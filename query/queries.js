require('dotenv').config({ path: "../.env"})

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DB,
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
})

// api/inventory/:hospital_id/:date
const getInventoryByHospitalId = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);
    const date = request.params.date;


    pool.query('SELECT distinct item_id, item_name, SUM(qty) over (partition by item_id) as total \
    FROM sku inner JOIN requests on requests.id = request_id left join items on item_id = items.id \
    WHERE requests.hospital_id = $1 and requests.date_time <= $2', [hospital_id, date], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

// api/hospitals
const getAllHospitals = (request, response) => {
    pool.query('SELECT * FROM hospitals', (err, results) => {
        if (err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

// api/suppliers
const getAllSuppliers = (request, response) => {
    pool.query('SELECT * FROM suppliers WHERE id <> 0', (err, results) => {
        if (err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows);
    })
}

// api/suppliers/:itemID

const getSuppliersByItemId = (request, response) => {
    const item_id = parseInt(request.params.itemID);
    
    pool.query('SELECT DISTINCT id, name FROM supply left join suppliers \
                ON supply.supplier_id = suppliers.id \
                WHERE item_id = $1', [item_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        response.status(400).json("ERROR");
                    }
                    response.status(200).json(results.rows);
                })
}

const getUser = (request, response) => {
    

    pool.query('SELECT * FROM users WHERE ')
}

module.exports = {
    getInventoryByHospitalId,
    getAllHospitals,
    getAllSuppliers,
    getSuppliersByItemId
}