import { GetServerSidePropsContext } from 'next';
import { SupabaseClient, User } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase';

export type ProtectedRouteProps = {
    props: {
        user: User
        loggedIn: boolean
        [key: string]: any
    }
}

export type GuestRouteProps = {
    props: {
        loggedIn: boolean
        [key: string]: any
    }
}

export type ProtectedRouteRedirProps = {
    redirect: {
        destination: string
        permanent: boolean
    }
}

export type ProtectedRouteServerSideProps = ProtectedRouteProps | ProtectedRouteRedirProps

export type GuestRouteServerSideProps = GuestRouteProps | ProtectedRouteRedirProps

export type GetPropsFuncProps = {
    supabase?: SupabaseClient;
    context?: GetServerSidePropsContext
    [key: string]: any
}

export type GetPropsFunc = (option: GetPropsFuncProps) => void

export type ProtectedRouteOption = {
    context: GetServerSidePropsContext
    redirectTo?: string
    getPropsFunc?: GetPropsFunc
}

export const ProtectedRoute = async ({ context, redirectTo = '/', getPropsFunc = () => { } }: ProtectedRouteOption): Promise<ProtectedRouteServerSideProps> => {
    const supabase = await createServerSupabaseClient<Database>(context);

    const { data: { user }, error } = await supabase.auth.getUser();
    // We can do a re-direction from the server
    if (!user) {
        return {
            redirect: {
                destination: redirectTo ?? '/',
                permanent: false,
            },
        }
    }

    const resolvedProps = getPropsFunc ? await getPropsFunc({ context, user, supabase }) : {}
    // or, alternatively, can send the same values that client-side context populates to check on the client and redirect
    return {
        props: {
            ...resolvedProps,
            user,
            loggedIn: !!user,
        }
    }
}

export const GuestRoute = async ({ context, redirectTo = '/', getPropsFunc = () => { } }: ProtectedRouteOption): Promise<GuestRouteServerSideProps> => {
    const supabase = await createServerSupabaseClient<Database>(context);

    const { data: { user }, error } = await supabase.auth.getUser();
    // We can do a re-direction from the server
    if (user) {
        return {
            redirect: {
                destination: redirectTo ?? '/',
                permanent: false,
            },
        }
    }

    const resolvedProps = getPropsFunc ? await getPropsFunc({}) : {}
    // or, alternatively, can send the same values that client-side context populates to check on the client and redirect
    return {
        props: {
            ...resolvedProps,
            loggedIn: !!user,
        }
    }
}

export default ProtectedRoute