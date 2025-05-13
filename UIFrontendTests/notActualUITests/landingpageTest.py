import time 
from selenium import webdriver
from selenium.webdriver.common.by import By

print("=Landing page testing below=")

driver = webdriver.Chrome()

driver.get("http://localhost:3000/")
title = driver.title
driver.implicitly_wait(0.5)

#text_box = driver.find_element(by=By.NAME, value="my-text")
#submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
testerChoice = False
testSignin = True
testLogin = False
testC = 0
if(testerChoice):
    print("Would you like to 1: Login, 2: Register")
    testC = input("What would you like to choose? ")

if(testC == 1):
    testLogin = True
elif(testC == 2):
    testSignin = True
else:
    print("other input occured(Just displaying all element a)")
    testLogin = False
    testSignin = False

testSignin = True

elements = driver.find_elements(By.TAG_NAME, 'a')
testnum = 0
# time.sleep(2)
for e in elements:
    print("E: ",e.text, " Type: ", type(e))
    if(e.text == ""):
        print("===I was nothing===")
    #e.click()
    elif(testnum == 6 and testLogin):
        e.click()
        time.sleep(2)
        break 
    elif(testnum == 7 and testSignin):
        e.click()
        time.sleep(2)
        break 
    else:
        if(testnum <= 5):
            e.click()
        if(testnum == 5):
            time.sleep(2)
            elements[1].click()
            time.sleep(1)
    testnum+=1
    time.sleep(2)


# time.sleep(1)
'''
signup_button = driver.find_element(by=By.CLASS_NAME, value="hero-btn")
print("===Getting the elements===")
time.sleep(1)

signup_button.click()
print("===pressed the button===")
time.sleep(1)
'''

l_button = driver.find_element(By.LINK_TEXT, "Log In")
print("===Getting the elements===")
time.sleep(1)

l_button.click()
print("===pressed the button===")
time.sleep(3)

ret_button = driver.find_element(By.LINK_TEXT, "Return to Home Page")
print("===Getting the elements===", ret_button)
time.sleep(1)

ret_button.click()
print("===pressed the button===")
time.sleep(2)



driver.quit()

print("===Landing page testing is now over===")