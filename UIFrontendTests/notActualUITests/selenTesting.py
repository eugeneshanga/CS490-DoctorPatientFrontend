import time 
from selenium import webdriver
from selenium.webdriver.common.by import By

# This was code from the selenium website that I used to get used to selenium
print("hello world")

driver = webdriver.Chrome()

driver.get("https://www.selenium.dev/selenium/web/web-form.html")
title = driver.title
print("Title: ", title)
driver.implicitly_wait(0.5)

text_box = driver.find_element(by=By.NAME, value="my-text")
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
print("Getting the elements")
time.sleep(2)

text_box.send_keys("Selenium")
submit_button.click()
print("pressed the button")
time.sleep(2)

message = driver.find_element(by=By.ID, value="message")
text = message.text
print("got text: ", text)
time.sleep(2)

driver.quit()
