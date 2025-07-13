const { getDatabase } = require('../database/init');

class Part {
    constructor(data) {
        this.id = data.id;
        this.project_id = data.project_id;
        this.name = data.name;
        this.estimated_print_time = data.estimated_print_time;
        this.estimated_weight = data.estimated_weight;
        this.printed = Boolean(data.printed);
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Get all parts for a project
    static async findByProjectId(projectId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.all(
                "SELECT * FROM parts WHERE project_id = ? ORDER BY created_at ASC",
                [projectId],
                (err, rows) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    const parts = rows.map(row => new Part(row));
                    resolve(parts);
                }
            );
        });
    }

    // Get part by ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                "SELECT * FROM parts WHERE id = ?",
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
                    resolve(new Part(row));
                }
            );
        });
    }

    // Create new part
    static async create(partData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { project_id, name, estimated_print_time, estimated_weight, printed, notes } = partData;
            
            db.run(
                "INSERT INTO parts (project_id, name, estimated_print_time, estimated_weight, printed, notes) VALUES (?, ?, ?, ?, ?, ?)",
                [project_id, name, estimated_print_time || 0, estimated_weight || 0, printed || false, notes || null],
                function(err) {
                    if (err) {
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    const partId = this.lastID;
                    db.get(
                        "SELECT * FROM parts WHERE id = ?",
                        [partId],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Part(row));
                        }
                    );
                }
            );
        });
    }

    // Update part
    static async update(id, partData) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const { name, estimated_print_time, estimated_weight, printed, notes } = partData;
            
            db.run(
                "UPDATE parts SET name = ?, estimated_print_time = ?, estimated_weight = ?, printed = ?, notes = ? WHERE id = ?",
                [name, estimated_print_time, estimated_weight, printed, notes, id],
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
                        "SELECT * FROM parts WHERE id = ?",
                        [id],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Part(row));
                        }
                    );
                }
            );
        });
    }

    // Delete part
    static async delete(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                "DELETE FROM parts WHERE id = ?",
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

    // Toggle printed status
    static async togglePrinted(id) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.run(
                "UPDATE parts SET printed = NOT printed WHERE id = ?",
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
                        "SELECT * FROM parts WHERE id = ?",
                        [id],
                        (err, row) => {
                            db.close();
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(new Part(row));
                        }
                    );
                }
            );
        });
    }

    // Get parts statistics for a project
    static async getStatsByProjectId(projectId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN printed = 1 THEN 1 ELSE 0 END) as printed,
                    SUM(estimated_print_time) as total_print_time,
                    SUM(estimated_weight) as total_weight,
                    SUM(CASE WHEN printed = 1 THEN estimated_print_time ELSE 0 END) as printed_time,
                    SUM(CASE WHEN printed = 1 THEN estimated_weight ELSE 0 END) as printed_weight
                 FROM parts WHERE project_id = ?`,
                [projectId],
                (err, row) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    const stats = {
                        total: row.total || 0,
                        printed: row.printed || 0,
                        total_print_time: row.total_print_time || 0,
                        total_weight: row.total_weight || 0,
                        printed_time: row.printed_time || 0,
                        printed_weight: row.printed_weight || 0,
                        progress: row.total > 0 ? Math.round((row.printed / row.total) * 100) : 0,
                        time_progress: row.total_print_time > 0 ? Math.round((row.printed_time / row.total_print_time) * 100) : 0,
                        weight_progress: row.total_weight > 0 ? Math.round((row.printed_weight / row.total_weight) * 100) : 0
                    };
                    
                    resolve(stats);
                }
            );
        });
    }

    // Bulk update printed status
    static async bulkUpdatePrinted(ids, printed) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const placeholders = ids.map(() => '?').join(',');
            
            db.run(
                `UPDATE parts SET printed = ? WHERE id IN (${placeholders})`,
                [printed, ...ids],
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

    // Get parts sorted by print time (for print queue optimization)
    static async findByProjectIdSortedByTime(projectId, ascending = true) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const order = ascending ? 'ASC' : 'DESC';
            
            db.all(
                `SELECT * FROM parts WHERE project_id = ? ORDER BY estimated_print_time ${order}`,
                [projectId],
                (err, rows) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    const parts = rows.map(row => new Part(row));
                    resolve(parts);
                }
            );
        });
    }

    // Get remaining print time for unprinted parts
    static async getRemainingPrintTime(projectId) {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.get(
                "SELECT SUM(estimated_print_time) as remaining_time FROM parts WHERE project_id = ? AND printed = 0",
                [projectId],
                (err, row) => {
                    db.close();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row.remaining_time || 0);
                }
            );
        });
    }
}

module.exports = Part;

