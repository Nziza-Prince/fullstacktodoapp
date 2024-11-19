CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    todos JSONB NOT NULL DEFAULT '[]', -- Array of objects with title, completed, and _id
    version INTEGER NOT NULL DEFAULT 0, -- Corresponds to __v
    external_id VARCHAR(50) UNIQUE      -- Corresponds to _id
);
