// lib/database.ts - Cliente de banco direto para PostgreSQL
import { Pool } from 'pg'
import type { Product } from '@/lib/types'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'aquifaz_db',
})

export class Database {
  static async getProducts(): Promise<Product[]> {
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM products 
        WHERE active = true 
        ORDER BY created_at DESC 
        LIMIT 12
      `)
      client.release()
      
      return result.rows.map(this.mapProductRow)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM products 
        WHERE active = true AND category = $1
        ORDER BY created_at DESC 
        LIMIT 8
      `, [category])
      client.release()
      
      return result.rows.map(this.mapProductRow)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM products 
        WHERE active = true AND slug = $1
        LIMIT 1
      `, [slug])
      client.release()
      
      if (result.rows.length === 0) {
        return null
      }
      
      return this.mapProductRow(result.rows[0])
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async getSimilarProducts(currentProductId: string, category: string, limit: number = 3): Promise<Product[]> {
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM products 
        WHERE active = true 
          AND category = $1 
          AND id != $2
        ORDER BY created_at DESC 
        LIMIT $3
      `, [category, currentProductId, limit])
      client.release()
      
      return result.rows.map(this.mapProductRow)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }

  static async getAllProducts(
    page: number = 1,
    limit: number = 20,
    category?: string,
    active?: boolean,
    search?: string,
    featured?: boolean
  ): Promise<{ products: Product[]; count: number }> {
    try {
      const offset = (page - 1) * limit
      let whereClause = '1=1'
      const params: any[] = []
      let paramIndex = 1

      // Build dynamic WHERE clause
      if (category) {
        whereClause += ` AND category = $${paramIndex}`
        params.push(category)
        paramIndex++
      }

      if (active !== undefined) {
        whereClause += ` AND active = $${paramIndex}`
        params.push(active)
        paramIndex++
      }

      if (featured !== undefined) {
        whereClause += ` AND featured = $${paramIndex}`
        params.push(featured)
        paramIndex++
      }

      if (search) {
        whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
        params.push(`%${search}%`)
        paramIndex++
      }

      const client = await pool.connect()
      
      // Get count
      const countResult = await client.query(`
        SELECT COUNT(*) as count FROM products 
        WHERE ${whereClause}
      `, params)

      // Get products
      const result = await client.query(`
        SELECT * FROM products 
        WHERE ${whereClause}
        ORDER BY sort_order ASC, created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...params, limit, offset])

      client.release()
      
      return {
        products: result.rows.map(this.mapProductRow),
        count: parseInt(countResult.rows[0].count)
      }
    } catch (error) {
      console.error('Database error:', error)
      return { products: [], count: 0 }
    }
  }

  static async createProduct(productData: Partial<Product>): Promise<Product | null> {
    try {
      const client = await pool.connect()
      
      const result = await client.query(`
        INSERT INTO products (
          name, slug, description, category, price, image_url, active, featured,
          show_on_home, show_on_featured, images, thumbnail_url, discount_price,
          discount_start, discount_end, specifications, min_quantity, max_quantity,
          unit, tags, meta_description, sort_order, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW()
        ) RETURNING *
      `, [
        productData.name,
        productData.slug || this.generateSlug(productData.name || ''),
        productData.description,
        productData.category,
        productData.price,
        productData.image_url,
        productData.active ?? true,
        productData.featured ?? false,
        productData.show_on_home ?? true,
        productData.show_on_featured ?? false,
        JSON.stringify(productData.images || []),
        productData.thumbnail_url,
        productData.discount_price,
        productData.discount_start,
        productData.discount_end,
        JSON.stringify(productData.specifications || {}),
        productData.min_quantity ?? 1,
        productData.max_quantity,
        productData.unit ?? 'unidade',
        JSON.stringify(productData.tags || []),
        productData.meta_description,
        productData.sort_order ?? 0
      ])

      client.release()
      
      if (result.rows.length === 0) {
        return null
      }
      
      return this.mapProductRow(result.rows[0])
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      const client = await pool.connect()
      
      const result = await client.query(`
        UPDATE products SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          category = COALESCE($4, category),
          price = COALESCE($5, price),
          image_url = COALESCE($6, image_url),
          active = COALESCE($7, active),
          featured = COALESCE($8, featured),
          show_on_home = COALESCE($9, show_on_home),
          show_on_featured = COALESCE($10, show_on_featured),
          images = COALESCE($11, images),
          thumbnail_url = COALESCE($12, thumbnail_url),
          discount_price = COALESCE($13, discount_price),
          discount_start = COALESCE($14, discount_start),
          discount_end = COALESCE($15, discount_end),
          specifications = COALESCE($16, specifications),
          min_quantity = COALESCE($17, min_quantity),
          max_quantity = COALESCE($18, max_quantity),
          unit = COALESCE($19, unit),
          tags = COALESCE($20, tags),
          meta_description = COALESCE($21, meta_description),
          sort_order = COALESCE($22, sort_order),
          updated_at = NOW()
        WHERE id = $23
        RETURNING *
      `, [
        productData.name,
        productData.slug,
        productData.description,
        productData.category,
        productData.price,
        productData.image_url,
        productData.active,
        productData.featured,
        productData.show_on_home,
        productData.show_on_featured,
        productData.images ? JSON.stringify(productData.images) : null,
        productData.thumbnail_url,
        productData.discount_price,
        productData.discount_start,
        productData.discount_end,
        productData.specifications ? JSON.stringify(productData.specifications) : null,
        productData.min_quantity,
        productData.max_quantity,
        productData.unit,
        productData.tags ? JSON.stringify(productData.tags) : null,
        productData.meta_description,
        productData.sort_order,
        id
      ])

      client.release()
      
      if (result.rows.length === 0) {
        return null
      }
      
      return this.mapProductRow(result.rows[0])
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    try {
      const client = await pool.connect()
      
      const result = await client.query(`
        DELETE FROM products WHERE id = $1
      `, [id])

      client.release()
      
      return result.rowCount > 0
    } catch (error) {
      console.error('Database error:', error)
      return false
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM products WHERE id = $1
      `, [id])
      client.release()
      
      if (result.rows.length === 0) {
        return null
      }
      
      return this.mapProductRow(result.rows[0])
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category,
      price: parseFloat(row.price),
      image_url: row.image_url,
      created_at: row.created_at,
      active: row.active,
      featured: row.featured,
      show_on_home: row.show_on_home,
      show_on_featured: row.show_on_featured,
      images: row.images,
      thumbnail_url: row.thumbnail_url,
      original_price: row.original_price ? parseFloat(row.original_price) : undefined,
      discount_price: row.discount_price ? parseFloat(row.discount_price) : undefined,
      discount_start: row.discount_start,
      discount_end: row.discount_end,
      specifications: row.specifications,
      min_quantity: row.min_quantity,
      max_quantity: row.max_quantity,
      unit: row.unit,
      tags: row.tags,
      meta_description: row.meta_description,
      sort_order: row.sort_order,
      updated_at: row.updated_at,
      updated_by: row.updated_by,
    }
  }
}