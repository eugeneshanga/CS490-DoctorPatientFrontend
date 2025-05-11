import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Create Meal testing below=")

options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)

driver.get("http://localhost:3000/login")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'input')
print("elements:", elements)
testnum = 0

time.sleep(2)
# This will change when I give out id in my code
for e in elements:
    if(testnum == 0):
        print("Setting Email")
        e.send_keys("jane.doe@example.com")
        time.sleep(1)
    if(testnum == 1):
        print("Setting password")
        e.send_keys("password")
        time.sleep(1)
    testnum+=1

buttons = driver.find_elements(By.TAG_NAME, 'button')
print("Buttons?: ", buttons)
for b in buttons:
    print("b: ",b.text, " Type: ", type(b))
    b.click()
#buttons[0].click()
time.sleep(2)
print("Before alert click?")

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue

print("after alert click?")
time.sleep(2)


create_btn = driver.find_element(By.CLASS_NAME, "submit-metrics-button")
driver.execute_script("arguments[0].scrollIntoView(true);", create_btn)
time.sleep(0.5) # Let it settle visually
print("Clicking 'Create Mealplan' button...")
create_btn.click()

time.sleep(1)

try:
    print("Filling in meal plan form fields...")

    driver.find_element(By.NAME, "title").send_keys("Grilled Chicken Salad")
    time.sleep(0.5)
    print("Uploaded Desc.")
    driver.find_element(By.CSS_SELECTOR, 'input[type="text"][name="description"]').send_keys("A healthy grilled chicken meal")
    time.sleep(0.5)
    print("Uploaded instruct.")
    driver.find_element(By.NAME, "instructions").send_keys("Grill the chicken, mix with greens")
    time.sleep(0.5)
    print("Uploaded Ingred.")
    driver.find_element(By.NAME, "ingredients").send_keys("Chicken, Lettuce, Tomatoes, Olive Oil")
    time.sleep(0.5)
    print("Uploaded Cals.")
    driver.find_element(By.NAME, "calories").send_keys("350")
    time.sleep(0.5)
    print("Uploaded Fat.")
    driver.find_element(By.NAME, "fat").send_keys("15")
    time.sleep(0.5)
    print("Uploaded Sugar.")
    driver.find_element(By.NAME, "sugar").send_keys("5")
    time.sleep(0.5)

    # Upload image file
    #image_input = driver.find_element(By.NAME, "image")
    #image_input.send_keys("https://sundaysuppermovement.com/wp-content/uploads/2021/06/grilled-chicken-salad-1.jpg")
    #print("Uploaded image.")

    time.sleep(1)

    # Click the submit button
    buttons = driver.find_elements(By.CSS_SELECTOR, "div.modal-actions button")
    print("Found buttons:", [b.text for b in buttons])
    for b in buttons:
        if b.text.strip().lower() == "submit":
            print("Clicking submit...")
            b.click()
            break

except Exception as e:
    print("Error during mealplan form test:", e)

time.sleep(2)

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The Meal Create was a failure")
    pass  # No alert present, continue

print("Done.")
time.sleep(2)

driver.quit()

print("===Create Meal testing is now over===")