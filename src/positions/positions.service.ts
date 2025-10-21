import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create a new position
  async createPosition(position_code: string, position_name: string, id: number) {
  const [result] = await this.pool().execute<OkPacket>(
    'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
    [position_code, position_name, id],
  );
  return {
    position_Id: result.insertId,
    position_code,
    position_name,
    id,
  };
}

  // Get all positions
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, created_at, updated_at FROM positions',
    );
    return rows;
  }

  // Get position by ID
  async findById(positionId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, created_at, updated_at FROM positions WHERE position_id = ?',
      [positionId],
    );
    if (!rows.length) throw new NotFoundException('Position not found');
    return rows[0];
  }

  // Get position by code
  async findByCode(positionCode: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT position_id, position_code, position_name, created_at, updated_at FROM positions WHERE position_code = ?',
      [positionCode],
    );
    if (!rows.length) throw new NotFoundException('Position not found');
    return rows[0];
  }

  // Update position
  async updatePosition(positionId: number, partial: { position_code?: string; position_name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.position_code) {
      fields.push('position_code = ?');
      values.push(partial.position_code);
    }

    if (partial.position_name) {
      fields.push('position_name = ?');
      values.push(partial.position_name);
    }

    if (fields.length === 0) return this.findById(positionId);

    values.push(positionId);
    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(positionId);
  }

  // Delete position
  async deletePosition(positionId: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM positions WHERE position_id = ?',
      [positionId],
    );
    return res.affectedRows > 0;
  }
}