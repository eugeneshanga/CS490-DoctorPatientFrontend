import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Payment page testing below=")

options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)

driver.get("http://localhost:3000/login")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'input')
print("elements:", elements)
testnum = 0

time.sleep(1)
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
time.sleep(1)
print("Before alert click?")

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()
except:
    print("The login was a failure")
    pass

#element = driver.find_element(By.LINK_TEXT, "Login Successful") This shit was just broken and wrong
#element.click()
print("after alert click?")
time.sleep(2)

# This was just to view the dashboard buttons
buttons = driver.find_elements(By.TAG_NAME, 'button')
# print("Buttons?: ", buttons)
tempVal = 0
for b in buttons:
    print("t: ", tempVal)
    if tempVal != 3:
        b.click()
        #time.sleep(1)
    else:
        b.click()
        break
    tempVal+=1

time.sleep(1)

fBtn = driver.find_elements(By.CLASS_NAME, "fulfill-button")
fBtn[0].click()
time.sleep(2)

try:
    print("Finding input fields...")
    inputs = driver.find_elements(By.CSS_SELECTOR, "form input[type='text']")
    print(f"Found {len(inputs)} inputs")

    if len(inputs) < 4:
        raise Exception("Not all payment inputs found")

    print("Filling cardholder name...")
    inputs[0].clear()
    inputs[0].send_keys("Jane Doe")
    time.sleep(1)

    print("Filling card number...")
    inputs[1].clear()
    inputs[1].send_keys("4111111111111111")
    time.sleep(1)

    print("Filling expiration date...")
    inputs[2].clear()
    inputs[2].send_keys("1230")
    time.sleep(1)

    print("Filling CVV...")
    inputs[3].clear()
    inputs[3].send_keys("123")
    time.sleep(1)

    # Submit payment
    pay_button = driver.find_element(By.ID, "pay-btn")
    print("Clicking Pay Now button...")
    pay_button.click()
    time.sleep(1)

except Exception as e:
    print("Error during payment form test:", e)

time.sleep(2)

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()
except:
    print("The payment was a failure")
    pass

print("Done.")
time.sleep(2)

driver.quit()

print("===Payment page testing is now over===")