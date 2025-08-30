#DONATION IMPACT PREDICTION SYSTEM 

def donation_impact(campaign_type, donation_amount):
    costs = {
        'Education': 150,      # per education day
        'Food': 50,            # per meal
        'Health': 100,         # per day of healthcare
        'Arts': 100,           # per month per child
        'Shelter': 1000        # per square unit
    }

    if campaign_type == "Education":
        months = donation_amount // (costs['Education'] * 20)   # 20 days per month
        children = max(1, donation_amount // (costs['Education'] * 20 * months)) if months > 0 else 0
        education_days = donation_amount // costs['Education']
        return f"With ₹{donation_amount}, you can support {children} children for {months} months ({education_days} education days total)."

    elif campaign_type == "Food":
        months = donation_amount // (costs['Food'] * 30)   # 30 meals per month
        children = max(1, donation_amount // (costs['Food'] * 30 * max(1, months)))
        meals = donation_amount // costs['Food']
        return f"With ₹{donation_amount}, you can feed {children} children for {months} months ({meals} meals provided)."

    elif campaign_type == "Health":
        healthcare_days = donation_amount // costs['Health']
        children = max(1, healthcare_days // 30)   # assume 1 child needs ~30 days of care
        return f"With ₹{donation_amount}, you can provide healthcare for {children} children ({healthcare_days} days total)."

    elif campaign_type == "Arts":
        months = donation_amount // costs['Arts']
        children = max(1, donation_amount // (costs['Arts'] * months)) if months > 0 else 0
        return f"With ₹{donation_amount}, you can provide arts education for {children} children for {months} months."

    elif campaign_type == "Shelter":
        units = donation_amount // costs['Shelter']
        children = units * 5   # assume each shelter unit supports 5 kids
        return f"With ₹{donation_amount}, you can build {units} shelter units supporting {children} children."

    else:
        return "Invalid campaign type selected."







