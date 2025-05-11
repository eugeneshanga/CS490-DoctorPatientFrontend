import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Discussion page testing below=")

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
    #print("t: ", tempVal)
    if tempVal != 5:
        b.click()
        #time.sleep(1)
    else:
        b.click()
        break
    tempVal+=1

time.sleep(1)

# ADD POST FEATURE
print("ADD POST FEATURE")
add_post_btn = driver.find_element(By.XPATH, "//button[span[text()='Add post']]")
add_post_btn.click()
time.sleep(1)

upload_btn = driver.find_element(By.XPATH, "//button[normalize-space()='Upload Existing Meal Plan']")
upload_btn.click()
time.sleep(1)

meal_plan = driver.find_element(By.XPATH, "//ul/li[text()='Potato Salad (Olivier Salad)']")
meal_plan.click()
time.sleep(1)

upload_btn = driver.find_element(By.XPATH, "//button[text()='Upload']")
upload_btn.click()
time.sleep(1)

# REPLY POST FEATURE
print("REPLY POST FEATURE")
reply_buttons = driver.find_elements(By.XPATH, "//button[normalize-space()='Reply']")
reply_buttons[0].click()
time.sleep(1)

textarea = driver.find_element(By.XPATH, "//textarea[@placeholder='Write your reply...']")
textarea.send_keys("This is an automated test reply.")
time.sleep(1)

submit_button = driver.find_element(By.XPATH, "//button[normalize-space()='Submit Reply']")
submit_button.click()
time.sleep(1)

# UPVOTE FEATURE
print("UPVOTE FEATURE")
upvote_btn = driver.find_element(By.XPATH, "//button[normalize-space()='Upvote']")
upvote_btn.click()
time.sleep(1) 

# SORT POSTS FEATURE
print("SORT POST FEATURE")
sort_button = driver.find_element(By.XPATH, "//button[normalize-space()='Sort by Upvotes']")
sort_button.click()
time.sleep(2)

back_button = driver.find_element(By.XPATH, "//button[normalize-space()='Back to Dashboard']")
back_button.click()

print("Done.")
time.sleep(2)

driver.quit()

print("===Discussion page testing is now over===")