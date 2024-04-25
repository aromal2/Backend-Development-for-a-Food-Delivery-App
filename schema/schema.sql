
--Schema

-- Organization table
CREATE TABLE Organization (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Item table
CREATE TABLE Item (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    description TEXT
);

-- Pricing table
CREATE TABLE Pricing (
    organization_id INTEGER,
    item_id INTEGER,
    zone VARCHAR(255),
    base_distance_in_km INTEGER DEFAULT 5,
    km_price NUMERIC DEFAULT 1.5,
    fix_price NUMERIC DEFAULT 10,
    PRIMARY KEY (organization_id, item_id, zone),
    FOREIGN KEY (organization_id) REFERENCES Organization(id),
    FOREIGN KEY (item_id) REFERENCES Item(id)
);
