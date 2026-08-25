const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
    };

    const response = await fetch(`${SUPABASE_URL}/graphql/v1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({query, variables})
    });

    const json = await response.json();

    if (json.errors) {
        console.error('Error when awaiting for a response: ', json.errors);
        throw new Error('Failed to fetch GraphQL API');
    };

    return json.data as T;
} 