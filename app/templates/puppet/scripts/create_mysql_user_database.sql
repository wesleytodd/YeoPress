CREATE database IF NOT EXISTS <%= userInput.dbName %>;
CREATE USER '<%= userInput.dbUser %>'@'<%= userInput.dbHost %>' IDENTIFIED BY '<%= userInput.dbPass %>';
GRANT ALL PRIVILEGES ON <%= userInput.dbName %>.* TO '<%= userInput.dbUser %>'@'<%= userInput.dbHost %>';
FLUSH PRIVILEGES;
