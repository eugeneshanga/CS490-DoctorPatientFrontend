import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Metrics testing below=")

options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)

driver.get("http://localhost:3000/login")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'input')
print("elements:", elements)
testnum = 0

time.sleep(2)
for e in elements:
    if(testnum == 0):
        print("Setting Email")
        e.send_keys("jane.doe@example.com")
        time.sleep(2)
    if(testnum == 1):
        print("Setting password")
        e.send_keys("password")
        time.sleep(2)
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
    alert.accept()
except:
    print("The login was a failure")
    pass

#element = driver.find_element(By.LINK_TEXT, "Login Successful") This shit was just broken and wrong
#element.click()
print("after alert click?")
time.sleep(2)

buttons = driver.find_elements(By.TAG_NAME, 'button')
# print("Buttons?: ", buttons)
tempVal = 0
for b in buttons:
    print("t: ", tempVal)
    if tempVal != 2:
        b.click()
        time.sleep(1)
    else:
        b.click()
        break
    tempVal+=1

time.sleep(1)

button = driver.find_element(By.CLASS_NAME, "submit-metrics-button")
button.click()

try:
    print("Finding modal fields...")
    inputs = driver.find_elements(By.CSS_SELECTOR, "div.modal input[type='number']")

    print("Found inputs:", inputs)
    if len(inputs) < 3:
        raise Exception("Not all inputs found")

    print("Setting weight...")
    inputs[0].clear()
    inputs[0].send_keys("150")
    time.sleep(1)

    print("Setting height...")
    inputs[1].clear()
    inputs[1].send_keys("65")
    time.sleep(1)

    print("Setting extra calories...")
    inputs[2].clear()
    inputs[2].send_keys("300")
    time.sleep(1)

    total_text = driver.find_element(By.CSS_SELECTOR, "div.modal p").text
    print("Total calories display:", total_text)

    buttons = driver.find_elements(By.CSS_SELECTOR, "div.modal-actions button")
    print("Modal buttons found:", [b.text for b in buttons])

    for b in buttons:
        if b.text.strip().lower() == "submit":
            b.click()
            print("Clicked Submit.")
            break

except Exception as e:
    print("Error interacting with modal:", e)

    time.sleep(2)

time.sleep(2)
driver.quit()
print("===Metrics page testing is now over===")