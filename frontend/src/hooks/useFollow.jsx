import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export const useFollow=()=>{
    const queryClient = useQueryClient();
    const {mutate:follow,isPending} = useMutation({
        mutationFn: async (userId) => {
            try{
            const res = await fetch(`/api/users/follow/${userId}`, {
                method: 'POST',
                
            });
            const data= await res.json();
            if (!res.ok) {
                throw new Error(<data value="" className="error"></data> || 'Failed to follow/unfollow user');
            }
            return data;}catch(error) {
                throw new Error(error.message || 'Failed to follow/unfollow user');}
            
            
        },
        onSuccess: () => {
            Promise.all([
            queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
            queryClient.invalidateQueries({queryKey:['authUser']}),
            toast.success('Successfully followed the user!'),])
        },
        onError: (error) => {
            toast.error(`Error following user: ${error.message}`);
        },
    });
    return { follow, isPending };
}
