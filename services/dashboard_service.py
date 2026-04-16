from models.expense_model import get_total_expense, fetch_expense
from models.sales_model import get_total_sales, fetch_sales
from models.goat_model import fetch_all_goats
from models.health_model import fetch_vaccination_due
from models.feeding_model import fetch_feeding

def get_dashboard():
    goats = fetch_all_goats()
    expenses = fetch_expense()
    sales = fetch_sales()
    feeding = fetch_feeding()
    vaccination_due = fetch_vaccination_due()

    # 🐐 Goat counts
    total_goats = len(goats)
    healthy = len([g for g in goats if g["status"] == "Healthy"])
    sick = len([g for g in goats if g["status"] == "Sick"])
    sold = len([g for g in goats if g["status"] == "Sold"])
    pregnant = len([g for g in goats if g["status"] == "Pregnant"])

    # 💰 Financials
    total_expense = get_total_expense()
    total_sales = get_total_sales()
    profit = total_sales - total_expense

    # 📊 Expense breakdown
    expense_by_type = {}
    for e in expenses:
        key = e["expense_type"]
        expense_by_type[key] = expense_by_type.get(key, 0) + e["amount"]

    # 💵 Sales stats
    total_sales_count = len(sales)
    avg_sale_price = (total_sales / total_sales_count) if total_sales_count > 0 else 0

    # 🍽 Feeding stats
    total_feeding_records = len(feeding)

    # 💉 Vaccination due
    vaccination_due_count = len(vaccination_due)

    # 🕒 Recent activities (last 5)
    recent_sales = sorted(sales, key=lambda x: x["date"], reverse=True)[:5]
    recent_expenses = sorted(expenses, key=lambda x: x["date"], reverse=True)[:5]

    return {
        # 🐐 Goat Summary
        "goats": {
            "total": total_goats,
            "healthy": healthy,
            "sick": sick,
            "sold": sold,
            "pregnant": pregnant
        },

        # 💰 Financial Summary
        "finance": {
            "total_expense": total_expense,
            "total_sales": total_sales,
            "profit": profit,
            "expense_breakdown": expense_by_type
        },

        # 💵 Sales Insights
        "sales": {
            "total_sales_count": total_sales_count,
            "average_sale_price": avg_sale_price
        },

        # 🍽 Feeding
        "feeding": {
            "total_records": total_feeding_records
        },

        # 💉 Health
        "health": {
            "vaccination_due_count": vaccination_due_count
        },

        # 🕒 Activity
        "recent_activity": {
            "recent_sales": recent_sales,
            "recent_expenses": recent_expenses
        }
    }