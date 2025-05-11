import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Pharmacy page testing below=")

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
        e.send_keys("goodhealthrx@example.com")
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
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue

print("after alert click?")
time.sleep(2)

# This was just to view the dashboard buttons
buttons = driver.find_elements(By.TAG_NAME, 'button')
# print("Buttons?: ", buttons)
tempVal = 0
for b in buttons:
    print("t: ", tempVal)
    if tempVal != 4:
        #print("b: ",b.text, " Type: ", type(b), "val: ", tempVal)
        #print("b: ", b)
        b.click()
        time.sleep(1)
    else:
        b.click()
        time.sleep(1)
        break
    tempVal+=1

time.sleep(2)

driver.quit()

print("===Pharmacy page testing is now over===")