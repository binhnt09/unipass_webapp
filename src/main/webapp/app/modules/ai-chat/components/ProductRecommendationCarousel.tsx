import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from 'app/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'app/shared/ui/carousel';
import { Button } from 'app/shared/ui/button';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  condition: string;
  // images could be fetched if eager loaded, else we just use a placeholder
}

export const ProductRecommendationCarousel = ({ productIds }: { productIds: number[] }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = productIds.map(id => axios.get<Product>(`/api/products/${id}`));
        const responses = await Promise.all(productPromises);
        setProducts(responses.map(res => res.data));
      } catch (error) {
        console.error('Failed to fetch recommended products', error);
      } finally {
        setLoading(false);
      }
    };

    if (productIds && productIds.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [productIds]);

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse mt-2">Đang tải sản phẩm gợi ý...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mt-4 mb-2">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map(product => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={`/api/products/images/${product.id}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-gray-400 text-xs">No Image</div>';
                      }
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-bold text-sm">{product.price?.toLocaleString()} đ</span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">{product.condition}</span>
                  </div>
                  <Button asChild className="w-full mt-3 h-8 text-xs" variant="default">
                    <Link to={`/product/${product.id}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-2" />
        <CarouselNext className="hidden md:flex right-2" />
      </Carousel>
    </div>
  );
};
