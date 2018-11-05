# db-transfer
A collection of utility scripts for moving database table data between
relational databases

## Installation
1. Clone the repository.
```sh
git@github.com:akhale3/db-transfer.git
```
2. Install dependencies
```sh
npm install
```

## Compare Script
The `compare` command takes in 2 CSV files exported from either a MySQL or a
MSSQL database `cards` table. It specifically compares the `id` and `hash`
values from the first table against that in the second table. If there is not a
perfect match between any record, it adds the record to an `outliers` array,
and reports all outliers at the end in the form of a table (default) or a JSON
array. If the `id` does not exist in the second table, it reports the case as
`Missing`. If the case is not `Missing`, it is to be considered as `Duplicate`,
i.e. the `id` exists in the second table but with a different hash.

```sh
FILE_ONE='/path/to/table1/cards.csv' FILE_TWO='/path/to/table2/cards.csv' npm run compare
```

The default output format is a table. If you wish to consume a raw JSON output,
pass the `RAW=true` flag in addition to the above flags.

### Screenshots
1. Default Output Format

![Default Output Format](screenshots/default.png?raw=true "Default Output Format")

2. Raw Output Format

![Raw Output Format](screenshots/raw.png?raw=true "Raw Output Format")
