import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Appointment testing below=")

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
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue

print("after alert click?")
time.sleep(1)


search_button = driver.find_element(By.XPATH, "//button[normalize-space()='Search']")
search_button.click()
time.sleep(1)

book_buttons = driver.find_elements(By.XPATH, "//button[normalize-space()='Book Appointment']")
if book_buttons:
    book_buttons[0].click() # Clicks the first doctor’s button
    print("Clicked Book Appointment.")
else:
    print("No Book Appointment buttons found.")
time.sleep(1)

datetime_input = driver.find_element(By.XPATH, "//input[@type='datetime-local']")
datetime_input.send_keys("2025-05-14T10:35") 
time.sleep(1)

submit_button = driver.find_element(By.XPATH, "//button[normalize-space()='Submit']")
submit_button.click()
time.sleep(1)

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue

print("Done.")
time.sleep(2)

driver.quit()

# This is so the doctor can accept it

options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)

driver.get("http://localhost:3000/login")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'input')
print("elements:", elements)
testnum = 0

time.sleep(1)
# This will change when I give out id in my code
for e in elements:
    if(testnum == 0):
        print("Setting Email")
        e.send_keys("dr.house@example.com")
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
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue

#element = driver.find_element(By.LINK_TEXT, "Login Successful") This shit was just broken and wrong
#element.click()
#print("after alert click?")
time.sleep(1)

accept_button = driver.find_element(By.CLASS_NAME, "accept-btn")
accept_button.click()
print("Accepted.")
time.sleep(1)

confirm_button = driver.find_element(By.XPATH, "//div[@class='modal']//button[normalize-space()='Confirm']")
confirm_button.click()
print("Appointment confirmed.")
time.sleep(2)

driver.quit()

print("===Appointment testing is now over===")