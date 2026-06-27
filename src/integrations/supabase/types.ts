export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      category_copy: {
        Row: {
          category_key: Database["public"]["Enums"]["product_category_key"]
          created_at: string
          full_description: Json | null
          short_description: Json | null
          slug: string
          target_audience: Json | null
          title: Json | null
          updated_at: string
          usage: Json | null
        }
        Insert: {
          category_key: Database["public"]["Enums"]["product_category_key"]
          created_at?: string
          full_description?: Json | null
          short_description?: Json | null
          slug: string
          target_audience?: Json | null
          title?: Json | null
          updated_at?: string
          usage?: Json | null
        }
        Update: {
          category_key?: Database["public"]["Enums"]["product_category_key"]
          created_at?: string
          full_description?: Json | null
          short_description?: Json | null
          slug?: string
          target_audience?: Json | null
          title?: Json | null
          updated_at?: string
          usage?: Json | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          id: string
          issuer: string | null
          name: string
          position: number
          product_id: string
          reference: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issuer?: string | null
          name: string
          position?: number
          product_id: string
          reference?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issuer?: string | null
          name?: string
          position?: number
          product_id?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profile: {
        Row: {
          certificates: Json | null
          contact: Json | null
          created_at: string
          history: Json | null
          id: string
          mission: Json | null
          name: Json
          updated_at: string
          vision: Json | null
        }
        Insert: {
          certificates?: Json | null
          contact?: Json | null
          created_at?: string
          history?: Json | null
          id?: string
          mission?: Json | null
          name: Json
          updated_at?: string
          vision?: Json | null
        }
        Update: {
          certificates?: Json | null
          contact?: Json | null
          created_at?: string
          history?: Json | null
          id?: string
          mission?: Json | null
          name?: Json
          updated_at?: string
          vision?: Json | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: Json
          created_at: string
          id: string
          position: number
          product_id: string
          question: Json
        }
        Insert: {
          answer: Json
          created_at?: string
          id?: string
          position?: number
          product_id: string
          question: Json
        }
        Update: {
          answer?: Json
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          question?: Json
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          kind: Database["public"]["Enums"]["lead_kind"]
          locale: string | null
          message: string | null
          metadata: Json
          name: string | null
          organization: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          kind: Database["public"]["Enums"]["lead_kind"]
          locale?: string | null
          message?: string | null
          metadata?: Json
          name?: string | null
          organization?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          kind?: Database["public"]["Enums"]["lead_kind"]
          locale?: string | null
          message?: string | null
          metadata?: Json
          name?: string | null
          organization?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      migration_log: {
        Row: {
          batch_name: string
          error_log: string | null
          failed_records: number
          id: string
          notes: string | null
          processed_records: number
          status: string
          timestamp: string
          total_records: number
        }
        Insert: {
          batch_name: string
          error_log?: string | null
          failed_records?: number
          id?: string
          notes?: string | null
          processed_records?: number
          status: string
          timestamp?: string
          total_records: number
        }
        Update: {
          batch_name?: string
          error_log?: string | null
          failed_records?: number
          id?: string
          notes?: string | null
          processed_records?: number
          status?: string
          timestamp?: string
          total_records?: number
        }
        Relationships: []
      }
      product_documents: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["document_kind"]
          language: Database["public"]["Enums"]["language"] | null
          position: number
          product_id: string
          size_bytes: number | null
          src: string
          title: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["document_kind"]
          language?: Database["public"]["Enums"]["language"] | null
          position?: number
          product_id: string
          size_bytes?: number | null
          src: string
          title?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"]
          language?: Database["public"]["Enums"]["language"] | null
          position?: number
          product_id?: string
          size_bytes?: number | null
          src?: string
          title?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: Json | null
          created_at: string
          height: number | null
          id: string
          is_primary: boolean
          position: number
          product_id: string
          src: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt?: Json | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          position?: number
          product_id: string
          src: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt?: Json | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          position?: number
          product_id?: string
          src?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_seo: {
        Row: {
          canonical: string | null
          created_at: string
          description: Json | null
          id: string
          keywords: string[]
          og_image: string | null
          product_id: string
          title: Json | null
          updated_at: string
        }
        Insert: {
          canonical?: string | null
          created_at?: string
          description?: Json | null
          id?: string
          keywords?: string[]
          og_image?: string | null
          product_id: string
          title?: Json | null
          updated_at?: string
        }
        Update: {
          canonical?: string | null
          created_at?: string
          description?: Json | null
          id?: string
          keywords?: string[]
          og_image?: string | null
          product_id?: string
          title?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_seo_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_videos: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          position: number
          poster: string | null
          product_id: string
          provider: Database["public"]["Enums"]["media_provider"]
          src: string
          title: Json | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          position?: number
          poster?: string | null
          product_id: string
          provider?: Database["public"]["Enums"]["media_provider"]
          src: string
          title?: Json | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          position?: number
          poster?: string | null
          product_id?: string
          provider?: Database["public"]["Enums"]["media_provider"]
          src?: string
          title?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_key: Database["public"]["Enums"]["product_category_key"]
          cms_id: string | null
          code: string | null
          created_at: string
          description: Json | null
          features: Json | null
          id: string
          name: string
          search_tsv: unknown
          series: Json | null
          short_description: Json | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          category_key: Database["public"]["Enums"]["product_category_key"]
          cms_id?: string | null
          code?: string | null
          created_at?: string
          description?: Json | null
          features?: Json | null
          id?: string
          name: string
          search_tsv?: unknown
          series?: Json | null
          short_description?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          category_key?: Database["public"]["Enums"]["product_category_key"]
          cms_id?: string | null
          code?: string | null
          created_at?: string
          description?: Json | null
          features?: Json | null
          id?: string
          name?: string
          search_tsv?: unknown
          series?: Json | null
          short_description?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      related_products: {
        Row: {
          from_id: string
          position: number
          to_id: string
        }
        Insert: {
          from_id: string
          position?: number
          to_id: string
        }
        Update: {
          from_id?: string
          position?: number
          to_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_products_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_to_id_fkey"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_groups: {
        Row: {
          created_at: string
          id: string
          key: string
          label: Json
          position: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: Json
          position?: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: Json
          position?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "specification_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_items: {
        Row: {
          created_at: string
          group_id: string
          id: string
          key: string
          label: Json
          position: number
          unit: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          key: string
          label: Json
          position?: number
          unit?: string | null
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          key?: string
          label?: Json
          position?: number
          unit?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "specification_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "specification_groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      document_kind:
        | "BROCHURE"
        | "MANUAL"
        | "DATASHEET"
        | "CERTIFICATE"
        | "WARRANTY"
        | "OTHER"
      language: "EN" | "FA" | "AR"
      lead_kind: "contact" | "newsletter"
      lead_status: "new" | "notified" | "archived"
      media_provider: "YOUTUBE" | "VIMEO" | "SELF_HOSTED"
      product_category_key:
        | "POWER_WHEELCHAIRS"
        | "MANUAL_WHEELCHAIRS"
        | "MOBILITY_AIDS"
        | "ACCESSORIES"
        | "SPARE_PARTS"
      product_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_kind: [
        "BROCHURE",
        "MANUAL",
        "DATASHEET",
        "CERTIFICATE",
        "WARRANTY",
        "OTHER",
      ],
      language: ["EN", "FA", "AR"],
      lead_kind: ["contact", "newsletter"],
      lead_status: ["new", "notified", "archived"],
      media_provider: ["YOUTUBE", "VIMEO", "SELF_HOSTED"],
      product_category_key: [
        "POWER_WHEELCHAIRS",
        "MANUAL_WHEELCHAIRS",
        "MOBILITY_AIDS",
        "ACCESSORIES",
        "SPARE_PARTS",
      ],
      product_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    },
  },
} as const
