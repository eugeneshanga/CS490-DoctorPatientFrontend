# conftest.py
import pytest
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

BASE_URL = "http://localhost:3000"

@pytest.fixture(scope="module")
def driver():
    options = webdriver.FirefoxOptions()
    options.set_capability("unhandledPromptBehavior", "accept")
    svc = Service(GeckoDriverManager().install())
    drv = webdriver.Firefox(service=svc, options=options)
    yield drv
    drv.quit()

@pytest.fixture
def login_as_pharmacy(driver):
    driver.get(f"{BASE_URL}/login")
    # wait for the login form
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "email-field"))
    )
    driver.find_element(By.ID, "email-field").send_keys("pharma1@example.com")
    driver.find_element(By.ID, "password-field").send_keys("password")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    # wait for Dashboard tab to appear
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Dashboard']"))
    )
    return driver