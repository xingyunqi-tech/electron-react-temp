import { Link } from 'react-router-dom';

import { PRODUCTS_LIST } from '@/constants/site';

import styles from './index.module.scss';

interface ProductItem {
  title: string;
  description: string;
  link: string;
}

interface ProductCardsSectionProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: ProductItem[];
  className?: string;
}

export default function ProductCardsSection({
  title = '产品',
  ctaText = '探索全部产品',
  ctaLink = '/products',
  items = PRODUCTS_LIST,
  className,
}: ProductCardsSectionProps) {
  return (
    <section className={`${styles.products}${className ? ` ${className}` : ''}`}>
      <div className={styles.productsInner}>
        <h3 className={styles.productsTitle}>{title}</h3>
        <div className={styles.productCards}>
          {items.map(product => (
            <div key={product.title} className={styles.productCard}>
              <h4 className={styles.productName}>{product.title}</h4>
              <p className={styles.productDescription}>{product.description}</p>
              <Link to={ctaLink} className={styles.productLink}>
                {product.link}
              </Link>
            </div>
          ))}
        </div>
        <Link to={ctaLink} className={styles.darkOutlineBtn}>
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
