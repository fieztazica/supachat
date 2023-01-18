export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName: string
          query: string
          variables: Json
          extensions: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      channels: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: number
          name: string | null
          owner_id: string | null
          total_members: number
          type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          owner_id?: string | null
          total_members?: number
          type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          owner_id?: string | null
          total_members?: number
          type?: string
        }
      }
      members: {
        Row: {
          channel_id: number
          created_at: string | null
          id: number
          is_owner: boolean
          nickname: string | null
          user_id: string
        }
        Insert: {
          channel_id: number
          created_at?: string | null
          id?: number
          is_owner?: boolean
          nickname?: string | null
          user_id: string
        }
        Update: {
          channel_id?: number
          created_at?: string | null
          id?: number
          is_owner?: boolean
          nickname?: string | null
          user_id?: string
        }
      }
      messages: {
        Row: {
          channel_id: number
          content: string | null
          created_at: string | null
          id: string
          reactions: string[] | null
          reply_to_message_id: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          channel_id: number
          content?: string | null
          created_at?: string | null
          id: string
          reactions?: string[] | null
          reply_to_message_id?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          channel_id?: number
          content?: string | null
          created_at?: string | null
          id?: string
          reactions?: string[] | null
          reply_to_message_id?: string | null
          type?: string | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: { size: number; bucket_id: string }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits: number
          levels: number
          offsets: number
          search: string
          sortcolumn: string
          sortorder: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
