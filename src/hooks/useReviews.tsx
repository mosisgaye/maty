
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  title: string;
  content: string;
  product_type: 'mobile_plan' | 'internet_box';
  product_id: string | null;
  created_at: string;
  approved?: boolean;
}

export const useReviews = (productType: 'mobile_plan' | 'internet_box') => {
  const fetchReviews = async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_type', productType)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to fetch reviews');
    }

    return (data || []).map(item => ({
      id: item.id,
      author_name: item.author_name,
      author_avatar: item.author_avatar,
      rating: item.rating,
      title: item.title,
      content: item.content,
      product_type: item.product_type as 'mobile_plan' | 'internet_box',
      product_id: item.product_id,
      created_at: item.created_at || new Date().toISOString()
    }));
  };

  return useQuery({
    queryKey: ['reviews', productType],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
