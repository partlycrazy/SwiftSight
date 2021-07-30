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

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

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

const getProductInventoryByHospitalIdTest = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    const date = request.params.date;

    pool.query('SELECT DISTINCT orders.product_id, title, SUM(quantity) OVER (PARTITION BY orders.product_id) AS total \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                LEFT JOIN products ON orders.product_id = products.product_id \
                WHERE hospital_id = $1 AND time_fulfilled <= $2 \
                ORDER BY orders.product_id ASC', [hospital_id, date], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getCategoryInventoryByHospitalIdTest = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    const date = request.params.date;

    pool.query('SELECT DISTINCT category_id, category_title, SUM(quantity) OVER (PARTITION BY category_id) AS total \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                LEFT JOIN (SELECT * FROM products natural JOIN categories) AS product_category \
                ON orders.product_id = product_category.product_id \
                WHERE hospital_id = $1 AND time_fulfilled <= $2 \
                ORDER BY category_id ASC', [hospital_id, date], (err, results) => {
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

    if (isNaN(item_id)) {
        response.status(400).json("ERROR NOT INT");
    }
    
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

const getSuppliersByItemIdTest = (request, response) => {
    const item_id = parseInt(request.params.itemID);

    if (isNaN(item_id)) {
        response.status(400).json("ERROR NOT INT");
    }

    pool.query('SELECT DISTINCT product_id, supplier_id, supplier_name \
                FROM max_production NATURAL JOIN suppliers \
                WHERE product_id = $1 \
                ORDER BY supplier_id ASC', [item_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        response.status(400).json("ERROR");
                    }
                    response.status(200).json(results.rows);
                })
}

const getCurrentNonICUOccupancyNumber = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT SUM(quantity) AS patients \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                NATURAL JOIN products \
                WHERE hospital_id = $1 AND product_id = 0', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getCurrentICUOccupancyNumber = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT SUM(quantity) AS patients \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                NATURAL JOIN products \
                WHERE hospital_id = $1 AND product_id = 1', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getCurrentNonICUOccupancyPercentage = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT patients/max_patient_capacity*100 as percentage \
                FROM (SELECT SUM(quantity) AS patients, AVG(hospital_id) as hospital_id \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                natural JOIN products WHERE hospital_id = $1 AND product_id = 0) AS total_patient \
                NATURAL JOIN hospitals', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getCurrentICUOccupancyPercentage = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT patients/max_patient_capacity*100 as percentage \
                FROM (SELECT SUM(quantity) AS patients, AVG(hospital_id) as hospital_id \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                natural JOIN products WHERE hospital_id = $1 AND product_id = 1) AS total_patient \
                NATURAL JOIN hospitals', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getUpcomingShipments = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT supplier_name, title, time_created, quantity \
                FROM supply_orders NATURAL JOIN products NATURAL JOIN suppliers \
                WHERE fulfilled IS FALSE AND hospital_id = $1 AND supplier_id <> 0 \
                ORDER BY time_created ASC', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
    })
}

const getPastShipments = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT supplier_name, title, time_created, quantity \
                FROM supply_orders NATURAL JOIN products NATURAL JOIN suppliers \
                WHERE fulfilled IS TRUE AND hospital_id = $1 AND supplier_id <> 0 \
                ORDER BY time_created ASC', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
        }
        response.status(200).json(results.rows)
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