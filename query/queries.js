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
const getProductInventoryByHospitalIdTest = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    const date = request.params.date;

    pool.query('SELECT DISTINCT product_id, title, SUM(quantity) OVER (PARTITION BY product_id) AS total \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                NATURAL JOIN products \
                WHERE hospital_id = $1 AND time_fulfilled <= $2 AND product_id NOT IN (0, 1) \
                ORDER BY product_id ASC', [hospital_id, date], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/inventory/:hospital_id/:date
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
                WHERE hospital_id = $1 AND time_fulfilled <= $2 AND category_id <> 0 \
                ORDER BY category_id ASC', [hospital_id, date], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return;
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
            return;
        }
        response.status(200).json(results.rows)
    })
}

// api/hospitals/:hospital_id
const getHospital = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return
    }

    pool.query('SELECT * FROM hospitals WHERE hospital_id = $1', [hospital_id], 
            (err, results) => {
                if (err) {
                    console.log(err);
                    response.status(400).json("ERROR");
                    return
                }
                response.status(200).json(results.rows);
            })
}

// api/suppliers
const getAllSuppliers = (request, response) => {
    pool.query('SELECT * FROM suppliers WHERE supplier_id <> 0', (err, results) => {
        if (err) {
            console.log(err);
            response.status(400).json("ERROR");
            return;
        }
        response.status(200).json(results.rows);
    })
}

// api/suppliers/by_category/:CategoryId
const getSuppliersByCategoryId = (request, response) => {
    const category_id = parseInt(request.params.CategoryId);

    if (isNaN(category_id)) {
        response.status(400).json("ERROR NOT INT");
    }
    
    pool.query('SELECT DISTINCT category_id, supplier_id, supplier_name, \
                SUM(amount) OVER (PARTITION BY (supplier_id)) AS max_production_amount, email_address, address \
                FROM max_production NATURAL JOIN (SELECT * FROM suppliers WHERE supplier_id <> 0) AS supplier \
                NATURAL JOIN ((SELECT * FROM categories WHERE category_id = $1) AS category NATURAL JOIN products) \
                ORDER BY supplier_id ASC', [category_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        response.status(400).json("ERROR");
                        return;
                    }
                    response.status(200).json(results.rows);
                })
}
// api/suppliers/by_product/:itemID
const getSuppliersByItemIdTest = (request, response) => {
    const item_id = parseInt(request.params.itemID);

    if (isNaN(item_id)) {
        response.status(400).json("ERROR NOT INT");
    }

    pool.query('SELECT DISTINCT product_id, supplier_id, supplier_name, \
                amount AS max_production_amount, email_address, address  \
                FROM max_production NATURAL JOIN (SELECT * FROM suppliers WHERE supplier_id <> 0) AS supplier \
                WHERE product_id = $1 \
                ORDER BY supplier_id ASC', [item_id], (err, results) => {
                    if (err) {
                        console.log(err)
                        response.status(400).json("ERROR");
                        return;
                    }
                    response.status(200).json(results.rows);
                })
}

// api/patients/non_icu/:hospital_id
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
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/patients/icu/:hospital_id
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
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/patients/non_icu/:hospital_id
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
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/patients/icu/:hospital_id
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
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/shipment/upcoming/:hospital_id
const getUpcomingShipments = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT order_id, supplier_name, product_id, title, time_created, quantity, category_id, category_title \
                FROM supply_orders NATURAL JOIN products NATURAL JOIN suppliers NATURAL JOIN categories\
                WHERE fulfilled IS FALSE AND hospital_id = $1 AND supplier_id <> 0 \
                ORDER BY time_created ASC', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return;
        }
        response.status(200).json(results.rows)
    })
}
// api/shipment/past/:hospital_id
const getPastShipments = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query('SELECT supplier_name, title, time_created, time_fulfilled, quantity \
                FROM supply_orders NATURAL JOIN products NATURAL JOIN suppliers \
                WHERE fulfilled IS TRUE AND hospital_id = $1 AND supplier_id <> 0 \
                ORDER BY time_created ASC', [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return
        }
        response.status(200).json(results.rows)
    })
}

// api/inventory/burn/:hospital_id
const getBurnOutRatePerDayPerPatient = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query(`SELECT category_id, category_title, burnrateperday/patients AS burnrate \
                FROM (SELECT DISTINCT hospital_id, SUM(quantity) OVER (PARTITION BY hospital_id) AS patients \ 
                FROM supply_orders WHERE product_id IN (0,1)) AS patientcount \
                NATURAL JOIN (SELECT DISTINCT hospital_id, category_id, (SUM(quantity) OVER (PARTITION BY hospital_id, category_id))/-7 AS burnRatePerDay \
                FROM (SELECT * FROM (SELECT * FROM supply_orders WHERE quantity < 0 AND fulfilled IS TRUE AND supplier_id = 0 \
                AND product_id NOT IN (0,1) AND time_fulfilled > (CURRENT_TIMESTAMP - INTERVAL '7 days')) AS temp3) AS temp \
                NATURAL JOIN products) AS temp2 NATURAL JOIN categories \
                WHERE hospital_id = $1`, [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return
        }
        response.status(200).json(results.rows)
    })
}

// api/inventory/burn/:hospital_id
const getDaysLeftByHospitalId = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);

    if (isNaN(hospital_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query(`SELECT category_id, category_title, ROUND(total/burnRatePerDay) AS daysLeft\
                FROM (SELECT DISTINCT category_id, category_title, SUM(quantity) OVER (PARTITION BY category_id) AS total \
                FROM (SELECT * FROM supply_orders WHERE fulfilled IS TRUE) AS orders \
                LEFT JOIN (SELECT * FROM products natural JOIN categories) AS product_category \
                ON orders.product_id = product_category.product_id \
                WHERE category_id <> 0) as inventories\
                NATURAL JOIN (SELECT DISTINCT hospital_id, category_id, (SUM(quantity) OVER (PARTITION BY hospital_id, category_id))/-7 AS burnRatePerDay \
                FROM (SELECT * FROM (SELECT * FROM supply_orders WHERE quantity < 0 AND fulfilled IS TRUE AND supplier_id = 0 \
                AND product_id NOT IN (0,1) AND time_fulfilled > (CURRENT_TIMESTAMP - INTERVAL '7 days')) AS temp3) AS temp \
                NATURAL JOIN products) AS temp2 NATURAL JOIN categories \
                WHERE hospital_id = $1`, [hospital_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return
        }
        response.status(200).json(results.rows)
    })
}

// api/suppliers/delivery/:hospital_id/:category_id
const getSuppliersByAvgDeliveryTime = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);
    const category_id = parseInt(request.params.category_id);
    if (isNaN(hospital_id) || isNaN(category_id)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }
    pool.query(`SELECT DISTINCT supplier_id, ROUND(CAST(EXTRACT(epoch from AVG(time_fulfilled - time_created) OVER (PARTITION BY supplier_id))/86400 AS numeric), 1) AS days_taken \
                FROM (SELECT * FROM supply_orders \
                WHERE product_id NOT IN (0,1) AND supplier_id <> 0 AND quantity > 0 \
                AND fulfilled IS TRUE AND hospital_id = $1) AS supplies \
                NATURAL JOIN (products NATURAL JOIN categories) WHERE category_id = $2 \
                ORDER BY days_taken ASC`, [hospital_id, category_id], (err, results) => {
        if(err) {
            console.log(err);
            response.status(400).json("ERROR");
            return
        }
        response.status(200).json(results.rows)
    })
}

// api/chart/:hospital_id/:days
const getChartData = (request, response) => {
    const hospital_id = parseInt(request.params.hospital_id);
    const days = request.params.days;

    if (isNaN(hospital_id) || isNaN(days)) {
        response.status(400).json("ERROR NOT INT");
        return;
    }

    pool.query(`SELECT categories.category_title, new_table.* FROM (SELECT order_id, time_fulfilled as datetime, hospital_id, category_id,  \
                SUM(quantity) OVER (PARTITION BY hospital_id, category_id ORDER BY time_fulfilled ROWS UNBOUNDED PRECEDING) AS total \
                FROM supply_orders NATURAL JOIN products \
                WHERE fulfilled  AND time_fulfilled IS NOT NULL) AS new_table NATURAL JOIN categories\
                WHERE category_id <> 0 AND datetime > (CURRENT_TIMESTAMP - INTERVAL '14 days') AND hospital_id = $1`,
                [hospital_id], (err, results) => {
                    if (err) {
                        console.log(err);
                        response.status(400).json("ERROR");
                        return;
                    }
                    response.status(200).json(results.rows);
                })
}

module.exports = {
    getAllHospitals,
    getHospital,
    getAllSuppliers,
    getPastShipments,
    getCategoryInventoryByHospitalIdTest,
    getCurrentICUOccupancyNumber,
    getCurrentICUOccupancyPercentage,
    getCurrentNonICUOccupancyNumber,
    getCurrentNonICUOccupancyPercentage,
    getUpcomingShipments,
    getSuppliersByItemIdTest,
    getSuppliersByCategoryId,
    getProductInventoryByHospitalIdTest,
    getChartData,
    getBurnOutRatePerDayPerPatient,
    getDaysLeftByHospitalId,
    getSuppliersByAvgDeliveryTime
}