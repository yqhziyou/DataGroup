-- Lookup Table
CREATE TABLE Lookup (
    LookupID NUMBER PRIMARY KEY,
    LookupType VARCHAR2(20) NOT NULL,
    Value VARCHAR2(50) NOT NULL
);

-- UserInformation Table
CREATE TABLE UserInformation (
    UserID NUMBER PRIMARY KEY,
    Username VARCHAR2(50) NOT NULL,
    Email VARCHAR2(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR2(255) NOT NULL,
    RegistrationDate DATE DEFAULT SYSDATE,
    LastLoginDate DATE
);

-- Sequence for UserID
CREATE SEQUENCE UserID_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- TransactionHistory Table
CREATE TABLE TransactionHistory (
    TransactionID NUMBER PRIMARY KEY,
    UserID NUMBER NOT NULL,
    TradeTypeID NUMBER NOT NULL,
    StockSymbol VARCHAR2(10) NOT NULL,
    Quantity NUMBER CHECK (Quantity > 0),
    Price NUMBER(10, 2) CHECK (Price >= 0),
    TransactionDate DATE DEFAULT SYSDATE,
    FOREIGN KEY (UserID) REFERENCES UserInformation(UserID),
    FOREIGN KEY (TradeTypeID) REFERENCES Lookup(LookupID)
);

-- Sequence for TransactionID
CREATE SEQUENCE TransactionID_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Strategy Table
CREATE TABLE Strategy (
    StrategyID NUMBER PRIMARY KEY,
    UserID NUMBER NOT NULL,
    StrategyTypeID NUMBER NOT NULL,
    StockSymbol VARCHAR2(10) NOT NULL,
    PurchasePrice NUMBER(10, 2) CHECK (PurchasePrice >= 0),
    OptionStrikePrice NUMBER(10, 2) CHECK (OptionStrikePrice >= 0),
    OptionPremium NUMBER(10, 2) CHECK (OptionPremium >= 0),
    Quantity NUMBER CHECK (Quantity > 0),
    ExpectedValue NUMBER(10, 2),
    CreationDate DATE DEFAULT SYSDATE,
    FOREIGN KEY (UserID) REFERENCES UserInformation(UserID),
    FOREIGN KEY (StrategyTypeID) REFERENCES Lookup(LookupID)
);

-- Sequence for StrategyID
CREATE SEQUENCE StrategyID_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- AuditLog Table
CREATE TABLE AuditLog (
    LogID NUMBER PRIMARY KEY,
    UserID NUMBER NOT NULL,
    Action VARCHAR2(50) NOT NULL,
    TableAffected VARCHAR2(50) NOT NULL,
    Timestamp TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES UserInformation(UserID)
);

-- Sequence for LogID
CREATE SEQUENCE LogID_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Indexes for frequent search columns
CREATE INDEX idx_transaction_stock ON TransactionHistory (StockSymbol);
CREATE INDEX idx_strategy_stock ON Strategy (StockSymbol);

-- Trigger to log changes in UserInformation table
CREATE OR REPLACE TRIGGER trg_userinfo_audit
AFTER INSERT OR UPDATE OR DELETE ON UserInformation
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (LogID, UserID, Action, TableAffected, Timestamp)
    VALUES (LogID_SEQ.NEXTVAL, :NEW.UserID, 'User Info Modified', 'UserInformation', SYSTIMESTAMP);
END;
/

-- Trigger to log changes in TransactionHistory table
CREATE OR REPLACE TRIGGER trg_transaction_audit
AFTER INSERT OR UPDATE OR DELETE ON TransactionHistory
FOR EACH ROW
DECLARE
    v_userid NUMBER;
BEGIN
    IF INSERTING OR UPDATING THEN
        v_userid := :NEW.UserID;
    ELSIF DELETING THEN
        v_userid := :OLD.UserID;
    END IF;
    INSERT INTO AuditLog (LogID, UserID, Action, TableAffected, Timestamp)
    VALUES (LogID_SEQ.NEXTVAL, v_userid, 'Transaction Modified', 'TransactionHistory', SYSTIMESTAMP);
END;
/


-- Package to group procedures and functions
CREATE OR REPLACE PACKAGE user_management_pkg IS
    PROCEDURE update_user_email(p_userid NUMBER, p_new_email VARCHAR2);
    PROCEDURE add_transaction(p_userid NUMBER, p_tradetypeid NUMBER, p_stocksymbol VARCHAR2, p_quantity NUMBER, p_price NUMBER);
    FUNCTION get_user_transaction_count(p_userid NUMBER) RETURN NUMBER;
    FUNCTION calculate_protective_put(p_purchase_price NUMBER, p_quantity NUMBER, p_option_premium NUMBER) RETURN NUMBER;
    FUNCTION calculate_covered_call(p_purchase_price NUMBER, p_quantity NUMBER, p_option_premium NUMBER) RETURN NUMBER;
END user_management_pkg;
/

-- Package Body
CREATE OR REPLACE PACKAGE BODY user_management_pkg IS
    PROCEDURE update_user_email(p_userid NUMBER, p_new_email VARCHAR2) IS
    BEGIN
        UPDATE UserInformation
        SET Email = p_new_email
        WHERE UserID = p_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('No user found with the given ID.');
            RAISE; 
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
            RAISE; 
    END;

    PROCEDURE add_transaction(p_userid NUMBER, p_tradetypeid NUMBER, p_stocksymbol VARCHAR2, p_quantity NUMBER, p_price NUMBER) IS
    BEGIN
        INSERT INTO TransactionHistory (TransactionID, UserID, TradeTypeID, StockSymbol, Quantity, Price, TransactionDate)
        VALUES (TransactionID_SEQ.NEXTVAL, p_userid, p_tradetypeid, p_stocksymbol, p_quantity, p_price, SYSDATE);
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('An error occurred while adding the transaction: ' || SQLERRM);
            RAISE; 
    END;

    FUNCTION get_user_transaction_count(p_userid NUMBER) RETURN NUMBER IS
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*)
        INTO v_count
        FROM TransactionHistory
        WHERE UserID = p_userid;
        RETURN v_count;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0;
    END;

    FUNCTION calculate_protective_put(p_purchase_price NUMBER, p_quantity NUMBER, p_option_premium NUMBER) RETURN NUMBER IS
        v_value NUMBER(10, 2);
    BEGIN
        v_value := (p_purchase_price + p_option_premium) * p_quantity;
        RETURN v_value;
    END;

    FUNCTION calculate_covered_call(p_purchase_price NUMBER, p_quantity NUMBER, p_option_premium NUMBER) RETURN NUMBER IS
        v_value NUMBER(10, 2);
    BEGIN
        v_value := (p_purchase_price - p_option_premium) * p_quantity;
        RETURN v_value;
    END;
END user_management_pkg;
/
