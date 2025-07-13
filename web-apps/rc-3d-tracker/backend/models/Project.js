const { getDatabase } = require('../database/init');

class Project {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.aircraft_model = data.aircraft_model;
        this.description = data.description;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Get all projects
    static async findAll() {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.all(
                "SELECT * FROM projects ORDER BY created_at DESC",
                [],
                (err, rows) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    const projects = rows.map(row => new Project(row));
                    resolve(projects);
                }
            );
        });
    }

    // Get project by ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                "SELECT * FROM projects WHERE id = ?",
                [id],
                (err, row) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                        resolve(null);
                        return;
                    }
                    resolve(new Project(row));
                }
            );
        });
    }

    // Create new project
    static async create(projectData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { name, aircraft_model, description } = projectData;
            
            db.run(
                "INSERT INTO projects (name, aircraft_model, description) VALUES (?, ?, ?)",
                [name, aircraft_model, description],
                function(err) {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    const projectId = this.lastID;
                    db.get(
                        "SELECT * FROM projects WHERE id = ?",
                        [projectId],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Project(row));
                        }
                    );
                }
            );
        });
    }

    // Update project
    static async update(id, projectData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { name, aircraft_model, description } = projectData;
            
            db.run(
                "UPDATE projects SET name = ?, aircraft_model = ?, description = ? WHERE id = ?",
                [name, aircraft_model, description, id],
                function(err) {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    if (this.changes === 0) {
                        db.close();
                        resolve(null);
                        return;
                    }
                    
                    db.get(
                        "SELECT * FROM projects WHERE id = ?",
                        [id],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Project(row));
                        }
                    );
                }
            );
        });
    }

    // Delete project
    static async delete(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                "DELETE FROM projects WHERE id = ?",
                [id],
                function(err) {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.changes > 0);
                }
            );
        });
    }

    // Get project summary with counts and progress
    static async getSummary(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            
            // Get project details
            db.get(
                "SELECT * FROM projects WHERE id = ?",
                [id],
                (err, projectRow) => {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    if (!projectRow) {
                        db.close();
                        resolve(null);
                        return;
                    }
                    
                    // Get component statistics
                    db.get(
                        `SELECT 
                            COUNT(*) as total_components,
                            SUM(CASE WHEN purchased = 1 THEN 1 ELSE 0 END) as purchased_components
                         FROM components WHERE project_id = ?`,
                        [id],
                        (err, componentStats) => {
                            if (err) {
                                db.close();
                                reject(err);
                                return;
                            }
                            
                            // Get parts statistics
                            db.get(
                                `SELECT 
                                    COUNT(*) as total_parts,
                                    SUM(CASE WHEN printed = 1 THEN 1 ELSE 0 END) as printed_parts,
                                    SUM(estimated_print_time) as total_print_time,
                                    SUM(estimated_weight) as total_weight
                                 FROM parts WHERE project_id = ?`,
                                [id],
                                (err, partStats) => {
                                    db.close();
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    
                                    const summary = {
                                        project: new Project(projectRow),
                                        components: {
                                            total: componentStats.total_components || 0,
                                            purchased: componentStats.purchased_components || 0,
                                            progress: componentStats.total_components > 0 
                                                ? Math.round((componentStats.purchased_components / componentStats.total_components) * 100)
                                                : 0
                                        },
                                        parts: {
                                            total: partStats.total_parts || 0,
                                            printed: partStats.printed_parts || 0,
                                            progress: partStats.total_parts > 0 
                                                ? Math.round((partStats.printed_parts / partStats.total_parts) * 100)
                                                : 0,
                                            total_print_time: partStats.total_print_time || 0,
                                            total_weight: partStats.total_weight || 0
                                        }
                                    };
                                    
                                    resolve(summary);
                                }
                            );
                        }
                    );
                }
            );
        });
    }
}

module.exports = Project;

