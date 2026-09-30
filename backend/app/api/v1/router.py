from fastapi import APIRouter
from app.api.v1.endpoints import (
    accounting, ai, analytics, auth_customer, automation,
    cart, categories, checkout, coupons, dashboard,
    dev_ops, integrations, inventory, marketing, mobile_app,
    multitenant_vendor, notifications, order_management, performance,
    plugins, products, rbac, security, seo, shipping
)

api_router = APIRouter()

routers_list = [
    (auth_customer.router, "/auth", "Customer Auth & CRM"),
    (products.router, "/products", "Product Management"),
    (categories.router, "/categories", "Categories"),
    (inventory.router, "/inventory", "Inventory & Stock"),
    (cart.router, "/cart", "Cart System"),
    (checkout.router, "/checkout", "Checkout & Payments"),
    (order_management.router, "/orders", "Order Management"),
    (shipping.router, "/shipping", "Shipping System"),
    (coupons.router, "/coupons", "Coupons & Discounts"),
    (marketing.router, "/marketing", "Marketing Tools"),
    (seo.router, "/seo", "SEO & Sitemaps"),
    (analytics.router, "/analytics", "Analytics Dashboard"),
    (dashboard.router, "/dashboard", "Admin Dashboard"),
    (rbac.router, "/rbac", "Roles & Permissions"),
    (dev_ops.router, "/dev-ops", "Store Settings & DevOps"),
    (notifications.router, "/notifications", "Notification Engine"),
    (security.router, "/security", "Security & Audit Logs"),
    (ai.router, "/ai", "AI Features"),
    (plugins.router, "/plugins", "Plugin / Extension System"),
    (integrations.router, "/integrations", "API & Integrations"),
    (multitenant_vendor.router, "/vendors", "Multi-Vendor / SaaS"),
    (performance.router, "/performance", "Performance & Caching"),
    (mobile_app.router, "/mobile", "Mobile App APIs"),
    (accounting.router, "/accounting", "Accounting & Finance"),
    (automation.router, "/automation", "Event-Driven Automation")
]

for r, p, t in routers_list:
    api_router.include_router(r, prefix=p, tags=[t])