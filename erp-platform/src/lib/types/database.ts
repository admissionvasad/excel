export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Permissive database typing.
 *
 * The ERP is metadata-driven, so the repository layer works with dynamic table
 * names. This keeps full type-safety for hand-written domain models while still
 * allowing the generic dynamic engine to query arbitrary tables.
 */
export interface Database {
	public: {
		Tables: {
			[key: string]: {
				Row: Record<string, unknown>;
				Insert: Record<string, unknown>;
				Update: Record<string, unknown>;
			};
		};
		Views: {
			[key: string]: {
				Row: Record<string, unknown>;
			};
		};
		Functions: {
			[key: string]: {
				Args: Record<string, unknown>;
				Returns: unknown;
			};
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}
