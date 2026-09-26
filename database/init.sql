CREATE TABLE IF NOT EXISTS cidades_pesquisadas (
	id serial NOT NULL,
	cidade varchar(100) NOT NULL,
	estado varchar(100) NOT NULL,
	pais varchar(100) NOT NULL,
	longitude DECIMAL(10, 8) NOT NULL,
	latitude DECIMAL(10, 8) NOT NULL,
	criado_em timestamp DEFAULT CURRENT_TIMESTAMP
);