# Sycamore Backend Engineer Assessment

This repository contains the implementation of the Sycamore Backend Engineer Assessment using NestJS and TypeScript.

## 🚀 Implementation Overview

### Task A: The Idempotent Wallet
- **Framework**: NestJS with Sequelize ORM (SQLite for demonstration).
- **Features**:
  - ACID transactions for atomic transfers.
  - **Race Condition Prevention**: Implemented row-level locking (`SELECT FOR UPDATE`) to prevent double-spending in concurrent environments.
  - **Idempotency**: Implemented using an `idempotencyKey` stored in a `TransactionLog` table.
  - **Auditing**: Every transfer attempt is logged as `PENDING` before execution and updated to `SUCCESS` or `FAILED`.

### Task B: The Interest Accumulator
- **Feature**: Daily interest calculation at 27.5% per annum.
- **Precision**: Uses `decimal.js` to ensure zero floating-point errors.
- **Logic**: Handles leap years (365 vs 366 days) based on the target year.
- **Testing**: Comprehensive Jest unit tests included to verify accuracy.

---

## 📝 Interview Questions & Answers

### Q1: The Fintech Edge Case (Transactions)
**Question**: If the database connection drops after deducting from Sycamore's pool but before crediting the user, how do you ensure money doesn't disappear?

**Answer**:
To solve this, we must ensure **Atomicity** using Database Transactions. All operations (deduction, credit, and logging) should be wrapped in a single transaction block. If the connection drops or any part fails, the entire transaction is rolled back, restoring the pool balance. For added reliability, we use a **distributed locking** mechanism or **Idempotency keys** to ensure that when a client retries the failed operation, the system can determine its state and recover safely.

### Q2: Type Safety (unknown vs any)
**Question**: Which do you prefer between `unknown` and `any` in TypeScript? State reasons.

**Answer**: 
I prefer `unknown`. 
- `any` effectively disables the type checker, making the code as unsafe as vanilla JavaScript.
- `unknown` is the type-safe counterpart. It tells the compiler "we don't know the type yet," and it forces the developer to perform type narrowing (e.g., using `typeof`, `instanceof`, or user-defined type guards) before performing any operations on the value. This ensures type safety at compile time.

### Q3: Performance (10M+ Rows)
**Question**: What are the first three things you investigate if a 'Get My History' endpoint becomes slow on a large table?

**Answer**:
1. **Indexing**: Verify if the columns used in `WHERE`, `ORDER BY`, and `JOIN` clauses (e.g., `userId`, `createdAt`) have proper indexes.
2. **Execution Plan**: Use `EXPLAIN ANALYZE` to check for "Full Table Scans" and see if the query optimizer is choosing the correct indexes.
3. **Query Optimization & Pagination**: Ensure the query isn't fetching too many columns (`SELECT *`) and that efficient pagination (e.g., Keyset/Cursor-based pagination instead of large `OFFSET`) is implemented.

### Q4: Collaboration (Speed vs Architecture)
**Question**: A frontend developer says the API is too slow for the mobile home screen. How do you decide on the fix and communicate the trade-offs?

**Answer**:
I would first profile the request to identify the bottleneck (database, network, or computation).
- **If it's DB slowness**: I'd propose indexing or query refactoring.
- **If it's data volume**: I'd propose a "Thin DTO" (returning only what the home screen needs).
- **If it's frequent requests**: I'd propose Redis caching.
**Communication**: I'd explain the "Speed vs. Staleness" trade-off (for caching) or "Development Time" trade-off. We would agree on a short-term fix (simple optimization) vs. a long-term architectural change (Data projections or caching).

---

## 🛠 Setup & Run

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Run the App
```bash
# development
npm run start:dev
```
The API will be available at `http://localhost:3000`.
Visit `http://localhost:3000/api` for the **Swagger UI** documentation.

### Run Tests
```bash
# unit tests
npm run test
```

### Database
This project uses **SQLite** for ease of evaluation. The database file `database.sqlite` will be created automatically on the first run. Models are synchronized automatically.

---

## 📂 Project Structure
- `src/modules/wallet`: Contains Task A (Wallet logic, Models, Idempotency).
- `src/modules/interest`: Contains Task B (Interest calculator and unit tests).
- `src/main.ts`: Entry point with Swagger and Validation setup.