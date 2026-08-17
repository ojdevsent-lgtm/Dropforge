import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createOrder, loadStore, saveStore } from './store';

export default function Checkout({ cart, onBack, onComplete }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', city:'', country:'Nigeria' });
  const [coupon, setCoupon] = useState('');
  const [placed, setPlaced] = useState(null);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const discount = coupon.trim().toUpperCase() === 'FORGE20' ? subtotal * .2 : 0;
  const shipping = subtotal - discount >= 50 ? 0 : 4.99;
  const total = Math.max(0, subtotal - discount + shipping);
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) return;
    const order = createOrder({ items:cart, customer:form, coupon:coupon.trim().toUpperCase() || null });
    const store = loadStore();
    saveStore({ ...store, orders:[order, ...store.orders], cart:[], customer:form });
    setPlaced(order);
    onComplete(order);
  };
  if (placed) return <section className="checkout-page wrap"><div className="success"><CheckCircle2 size={54}/><p className="eyebrow">ORDER RECEIVED</p><h1>Thank you, {placed.customer.name.split(' ')[0]}.</h1><p>Your DropForge order <strong>{placed.id}</strong> has been created.</p><p>Total: <strong>${placed.total.toFixed(2)}</strong></p><button className="btn dark" onClick={onBack}>Continue shopping</button></div></section>;
  return <section className="checkout-page wrap"><button className="back" onClick={onBack}><ArrowLeft size={16}/> Back to shop</button><div className="checkout-layout"><form onSubmit={submit} className="checkout-form"><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete your order.</h1>{['name','email','phone','address','city'].map(name=><label key={name}>{name[0].toUpperCase()+name.slice(1)}<input required name={name} value={form[name]} onChange={update} placeholder={name==='address'?'Street address':''} type={name==='email'?'email':'tel'===name?'tel':'text'}/></label>)}<label>Country<select name="country" value={form.country} onChange={update}><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option></select></label><button className="btn dark full" type="submit">Place order · ${total.toFixed(2)}</button><small>Payment gateway is intentionally not connected yet. This version records the order locally.</small></form><aside className="order-summary"><h2>Your order</h2>{cart.map(i=><div className="summary-item" key={i.id}><span>{i.name} × {i.qty}</span><strong>${(i.price*i.qty).toFixed(2)}</strong></div>)}<div className="coupon"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Coupon code"/><button type="button" onClick={()=>setCoupon(coupon.trim().toUpperCase())}>Apply</button></div><div className="summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>{discount>0&&<div className="summary-row"><span>FORGE20</span><strong>−${discount.toFixed(2)}</strong></div>}<div className="summary-row"><span>Shipping</span><strong>{shipping===0?'FREE':`$${shipping.toFixed(2)}`}</strong></div><div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div></aside></div></section>;
}
