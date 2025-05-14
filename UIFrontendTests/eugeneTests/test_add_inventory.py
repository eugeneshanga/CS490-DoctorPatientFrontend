import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager

BASE_URL = "http://localhost:3000"

@pytest.fixture(scope="module")
def driver():
    options = webdriver.FirefoxOptions()
    # automatically accept any unexpected alerts
    options.set_capability("unhandledPromptBehavior", "accept")
    # install and point at geckodriver
    service = Service(GeckoDriverManager().install())
    # create the browser
    driver = webdriver.Firefox(service=service, options=options)
    yield driver
    driver.quit()

def login_as_pharmacy(driver):
    driver.get(f"{BASE_URL}/login")

    # wait for the email field to appear by its actual ID
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "email-field"))
    )

    # fill in email + password using their real IDs
    driver.find_element(By.ID, "email-field").send_keys("pharma1@example.com")
    driver.find_element(By.ID, "password-field").send_keys("password")

    # submit and wait for Dashboard tab
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Dashboard']"))
    )
def test_add_inventory_changes_list(driver):
    login_as_pharmacy(driver)

    # 1) Navigate to Dashboard
    driver.find_element(By.XPATH, "//button[text()='Dashboard']").click()
    time.sleep(0.5)

    # 2) Grab the list of inventory items *before* adding
    before_items = [
        li.text
        for li in driver.find_elements(By.CSS_SELECTOR, ".prescription-list li")
    ]

    # 3) Perform your “add 5 units” workflow
    select = driver.find_element(By.CSS_SELECTOR, ".inventory-form select")
    qty_input = driver.find_element(By.CSS_SELECTOR, ".inventory-form input[type=number]")
    add_btn = driver.find_element(By.CSS_SELECTOR, ".inventory-form button[type=submit]")

    select.click()
    select.find_element(By.XPATH, ".//option").click()   # pick whatever first option
    qty_input.clear()
    qty_input.send_keys("5")
    add_btn.click()

    # 4) Wait a moment then grab the *after* list
    time.sleep(1)
    after_items = [
        li.text
        for li in driver.find_elements(By.CSS_SELECTOR, ".prescription-list li")
    ]

    # 5) Assert that something changed
    assert before_items != after_items, f"Inventory should have changed, but before={before_items}, after={after_items}"

