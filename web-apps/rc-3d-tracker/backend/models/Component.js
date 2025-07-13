const { getDatabase } = require('../database/init');

class Component {
    constructor(data) {
        this.id = data.id;
        this.project_id = data.project_id;
        this.name = data.name;
        this.quantity = data.quantity;
        this.purchased = Boolean(data.purchased);
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Get all components for a project
    static async findByProjectId(projectId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.all(
                "SELECT * FROM components WHERE project_id = ? ORDER BY created_at ASC",
                [projectId],
                (err, rows) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    const components = rows.map(row => new Component(row));
                    resolve(components);
                }
            );
        });
    }

    // Get component by ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                "SELECT * FROM components WHERE id = ?",
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
                    resolve(new Component(row));
                }
            );
        });
    }

    // Create new component
    static async create(componentData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { project_id, name, quantity, purchased, notes } = componentData;
            
            db.run(
                "INSERT INTO components (project_id, name, quantity, purchased, notes) VALUES (?, ?, ?, ?, ?)",
                [project_id, name, quantity || 1, purchased || false, notes || null],
                function(err) {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    const componentId = this.lastID;
                    db.get(
                        "SELECT * FROM components WHERE id = ?",
                        [componentId],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Component(row));
                        }
                    );
                }
            );
        });
    }

    // Update component
    static async update(id, componentData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { name, quantity, purchased, notes } = componentData;
            
            db.run(
                "UPDATE components SET name = ?, quantity = ?, purchased = ?, notes = ? WHERE id = ?",
                [name, quantity, purchased, notes, id],
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
                        "SELECT * FROM components WHERE id = ?",
                        [id],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Component(row));
                        }
                    );
                }
            );
        });
    }

    // Delete component
    static async delete(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                "DELETE FROM components WHERE id = ?",
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

    // Toggle purchased status
    static async togglePurchased(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                "UPDATE components SET purchased = NOT purchased WHERE id = ?",
                [id],
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
                        "SELECT * FROM components WHERE id = ?",
                        [id],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Component(row));
                        }
                    );
                }
            );
        });
    }

    // Get components statistics for a project
    static async getStatsByProjectId(projectId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN purchased = 1 THEN 1 ELSE 0 END) as purchased,
                    SUM(quantity) as total_quantity,
                    SUM(CASE WHEN purchased = 1 THEN quantity ELSE 0 END) as purchased_quantity
                 FROM components WHERE project_id = ?`,
                [projectId],
                (err, row) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    const stats = {
                        total: row.total || 0,
                        purchased: row.purchased || 0,
                        total_quantity: row.total_quantity || 0,
                        purchased_quantity: row.purchased_quantity || 0,
                        progress: row.total > 0 ? Math.round((row.purchased / row.total) * 100) : 0,
                        quantity_progress: row.total_quantity > 0 ? Math.round((row.purchased_quantity / row.total_quantity) * 100) : 0
                    };
                    
                    resolve(stats);
                }
            );
        });
    }

    // Bulk update purchased status
    static async bulkUpdatePurchased(ids, purchased) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const placeholders = ids.map(() => '?').join(',');
            
            db.run(
                `UPDATE components SET purchased = ? WHERE id IN (${placeholders})`,
                [purchased, ...ids],
                function(err) {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.changes);
                }
            );
        });
    }
}

module.exports = Component;

