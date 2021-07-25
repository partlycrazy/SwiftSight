SELECT distinct item_id, item_name, SUM(qty) over (partition by item_id) as total \
FROM sku inner JOIN requests on requests.id = request_id left join items on item_id = items.id \
WHERE requests.hospital_id = $1 and requests.date_time <= $2



