import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export function FoodCard({ item, cartQuantity = 0, onAddToCart, onUpdateQuantity }) {
  const isAvailable = item.isAvailable !== false;

  return (
    <div className={`fc-card${!isAvailable ? ' fc-out' : ''}`}>
      {/* ── Image ──────────────────────────────── */}
      <div className="fc-img-wrap">
        <img
          src={item.image || '/images/masala_dosa.jpg'}
          alt={item.name}
          className="fc-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=60';
          }}
        />

        {/* Veg dot badge */}
        <div className="fc-veg">
          <div className="fc-veg-dot" />
        </div>

        {/* In-cart badge */}
        {cartQuantity > 0 && (
          <div className="fc-incart">{cartQuantity} in cart</div>
        )}

        {/* Sold-out ribbon */}
        {!isAvailable && (
          <div className="fc-soldout">Sold Out</div>
        )}
      </div>

      {/* ── Info ───────────────────────────────── */}
      <div className="fc-body">
        <p className="fc-name">{item.name}</p>
        <p className="fc-desc">{item.description}</p>

        {/* ── Footer: price + add/counter ──────── */}
        <div className="fc-footer">
          <span className="fc-price">{formatCurrency(item.price)}</span>

          {isAvailable ? (
            cartQuantity > 0 ? (
              <div className="fc-counter">
                <button
                  type="button"
                  className="fc-cnt-btn"
                  onClick={() => onUpdateQuantity(item.id, cartQuantity - 1)}
                  aria-label="Decrease"
                >
                  <Minus size={13} />
                </button>
                <span className="fc-cnt-num">{cartQuantity}</span>
                <button
                  type="button"
                  className="fc-cnt-btn"
                  onClick={() => onUpdateQuantity(item.id, cartQuantity + 1)}
                  aria-label="Increase"
                >
                  <Plus size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="fc-add-btn"
                onClick={() => onAddToCart(item)}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="fc-unavail">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
