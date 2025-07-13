const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

// Initialize database with schema
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
                return;
            }
            console.log('Connected to SQLite database');
        });

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        db.exec(schema, (err) => {
            if (err) {
                console.error('Error executing schema:', err.message);
                reject(err);
                return;
            }
            console.log('Database schema initialized successfully');
            
            // Insert sample data for development
            insertSampleData(db, () => {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                        reject(err);
                        return;
                    }
                    console.log('Database connection closed');
                    resolve();
                });
            });
        });
    });
}

// Insert sample data for development and testing
function insertSampleData(db, callback) {
    const sampleProject = {
        name: "F-35 Lightning II Scale Model",
        aircraft_model: "F-35",
        description: "1/6 scale F-35 Lightning II with working EDF and retractable landing gear"
    };

    db.run(
        "INSERT INTO projects (name, aircraft_model, description) VALUES (?, ?, ?)",
        [sampleProject.name, sampleProject.aircraft_model, sampleProject.description],
        function(err) {
            if (err) {
                console.error('Error inserting sample project:', err.message);
                callback();
                return;
            }

            const projectId = this.lastID;
            console.log('Sample project inserted with ID:', projectId);

            // Insert sample components
            const sampleComponents = [
                { name: "XFly 90mm EDF Unit", quantity: 1, purchased: false },
                { name: "6S 5000mAh LiPo Battery", quantity: 2, purchased: true },
                { name: "Spektrum AR8020T Receiver", quantity: 1, purchased: false },
                { name: "Servo - Digital High Torque", quantity: 6, purchased: true },
                { name: "Retractable Landing Gear Set", quantity: 1, purchased: false }
            ];

            const componentStmt = db.prepare(
                "INSERT INTO components (project_id, name, quantity, purchased) VALUES (?, ?, ?, ?)"
            );

            sampleComponents.forEach(component => {
                componentStmt.run(projectId, component.name, component.quantity, component.purchased);
            });
            componentStmt.finalize();

            // Insert sample parts
            const sampleParts = [
                { name: "Fuselage_Main.stl", estimated_print_time: 12.5, estimated_weight: 450, printed: true },
                { name: "Wing_Left.stl", estimated_print_time: 8.0, estimated_weight: 280, printed: true },
                { name: "Wing_Right.stl", estimated_print_time: 8.0, estimated_weight: 280, printed: false },
                { name: "Nose_Cone.stl", estimated_print_time: 4.5, estimated_weight: 120, printed: false },
                { name: "Landing_Gear_Bay.stl", estimated_print_time: 6.0, estimated_weight: 200, printed: false },
                { name: "Canopy.stl", estimated_print_time: 3.0, estimated_weight: 80, printed: true }
            ];

            const partStmt = db.prepare(
                "INSERT INTO parts (project_id, name, estimated_print_time, estimated_weight, printed) VALUES (?, ?, ?, ?, ?)"
            );

            sampleParts.forEach(part => {
                partStmt.run(projectId, part.name, part.estimated_print_time, part.estimated_weight, part.printed);
            });
            partStmt.finalize();

            console.log('Sample data inserted successfully');
            callback();
        }
    );
}

// Get database connection
function getDatabase() {
    return new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            throw err;
        }
    });
}

// Export functions
module.exports = {
    initializeDatabase,
    getDatabase,
    DB_PATH
};

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Database initialization completed');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Database initialization failed:', err);
            process.exit(1);
        });
}

