import time 
from selenium import webdriver
from selenium.webdriver.common.by import By

print("=Registration page testing below=")

driver = webdriver.Chrome()

driver.get("http://localhost:3000/")
title = driver.title
driver.implicitly_wait(0.5)


signup_button = driver.find_element(by=By.CLASS_NAME, value="hero-btn")
print("===Getting the elements===")
time.sleep(1)

signup_button.click()
print("===pressed the button===")
time.sleep(1)

elements = driver.find_elements(By.ID, 'users-btn')
# print("elements:", elements)
for e in elements:
    print("E: ",e.text, " Type: ", type(e))
    if(e.text == ""):
        print("===I was nothing===")
time.sleep(1)

# User Selection
elements[0].click()
time.sleep(1)
backOne = driver.find_element(By.ID, 'back-btn')
backOne.click()
time.sleep(2)

elements = driver.find_elements(By.ID, 'users-btn')
elements[1].click()
time.sleep(1)
backTwo = driver.find_element(By.ID, 'back-btn')
backTwo.click()
time.sleep(2)

elements = driver.find_elements(By.ID, 'users-btn')
elements[2].click()
time.sleep(1)
backTree = driver.find_element(By.ID, 'back-btn')
backTree.click()
time.sleep(2)

# PATIENT REG
pat = ["Avery", "Aaron", "avaaron@gmail.com", "pass123", "124 Internet St.", "07101", "1234562468"]
elements = driver.find_elements(By.ID, 'users-btn')
elements[0].click()
time.sleep(1)
the_fields = driver.find_elements(By.ID, 'text-in')
temp1 = 0
for t in the_fields:
    print("T: ", t)
    t.send_keys(pat[temp1])
    temp1+=1

time.sleep(2)
print("button")
submitpat = driver.find_element(By.ID, 'reg-btn')
submitpat.click()
time.sleep(1)
try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The Reg was a failure")
    pass  # No alert present, continue
time.sleep(2)

print("=Registration Patient Done=")

# DOCOTOR REG
signup_button = driver.find_element(by=By.CLASS_NAME, value="hero-btn")
print("===Getting the elements===")
time.sleep(1)

signup_button.click()
print("===pressed the button===")
time.sleep(2)
doc = ["Carl", "Kunst", "ckunst@gmail.com", "pass123", "123 Internet St.", "07101", "1234567890", "456", "192384567"]
elements2 = driver.find_elements(By.ID, 'users-btn')
elements2[1].click()
time.sleep(2)
the_fields = driver.find_elements(By.ID, 'text-in')
temp2 = 0
for t in the_fields:
    print("T: ", t)
    t.send_keys(doc[temp2])
    temp2+=1

time.sleep(2)
print("button")
submitdoc = driver.find_element(By.ID, 'reg-btn')
submitdoc.click()
time.sleep(2)
try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The Reg was a failure")
    pass  # No alert present, continue
time.sleep(2)

print("=Registration Doctor Done=")

# PHARM REG
signup_button = driver.find_element(by=By.CLASS_NAME, value="hero-btn")
print("===Getting the elements===")
time.sleep(1)

signup_button.click()
print("===pressed the button===")
time.sleep(1)
pharm = ["DWT", "dwt@example.com", "pass123", "123 Internet St.", "07101", "1234567890", "789"]
elements3 = driver.find_elements(By.ID, 'users-btn')
elements3[2].click()
time.sleep(2)
the_fields = driver.find_elements(By.ID, 'text-in')
temp3 = 0
for t in the_fields:
    print("T: ", t)
    t.send_keys(pharm[temp3])
    temp3+=1

time.sleep(1)
print("button")
submitpharm = driver.find_element(By.ID, 'reg-btn')
submitpharm.click()
time.sleep(1)
try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The Reg was a failure")
    pass  # No alert present, continue
#
time.sleep(1)
print("=Registration Pharmacy Done=")

driver.quit()

print("===Registration page testing is now over===")

#pat = ["Adam", "Aaron", "aaaron@gmail.com", "pass123", "124 Internet St.", "07101", "1234567890"]



