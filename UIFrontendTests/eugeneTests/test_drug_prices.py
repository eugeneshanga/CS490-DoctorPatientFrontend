# UIFrontendTests/eugeneTests/test_drug_prices.py
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
    options.set_capability("unhandledPromptBehavior", "accept")
    service = Service(GeckoDriverManager().install())
    drv = webdriver.Firefox(service=service, options=options)
    yield drv
    drv.quit()

def login_as_pharmacy(driver):
    driver.get(f"{BASE_URL}/login")
    # wait for and fill in credentials
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "email-field")))
    driver.find_element(By.ID, "email-field").send_keys("pharma1@example.com")
    driver.find_element(By.ID, "password-field").send_keys("password")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    # wait until Prices tab is available (indicates login succeeded)
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Prices']"))
    )

def test_update_drug_price(driver):
    login_as_pharmacy(driver)

    # 1) Go to Prices tab
    driver.find_element(By.XPATH, "//button[text()='Prices']").click()

    # 2) Wait for the prices table to populate
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".prices-table tbody tr"))
    )
    # grab the first row
    first_row = driver.find_element(By.CSS_SELECTOR, ".prices-table tbody tr")

    # 3) Read the current price from its <input>
    price_input = first_row.find_element(By.CSS_SELECTOR, "input[type=number]")
    old_price = float(price_input.get_attribute("value"))

    # 4) Change it by +1.00
    new_price = old_price + 1.0
    price_input.clear()
    price_input.send_keys(str(new_price))

    # 5) Click the “Save” button in that same row
    save_btn = first_row.find_element(By.TAG_NAME, "button")
    save_btn.click()

    # 6) Poll until the numeric value in that same input actually reaches new_price
    def value_updated(driver):
        # re‑locate the first‑row input each time
        elem = driver.find_element(
            By.CSS_SELECTOR,
            ".prices-table tbody tr:nth-child(1) input[type=number]"
        )
        try:
            return abs(float(elem.get_attribute("value")) - new_price) < 1e-6
        except Exception:
            return False

    WebDriverWait(driver, 5).until(value_updated)

    # 7) Final assertion
    current = float(driver.find_element(
        By.CSS_SELECTOR,
        ".prices-table tbody tr:nth-child(1) input[type=number]"
    ).get_attribute("value"))
    assert current == pytest.approx(new_price, rel=1e-3)
