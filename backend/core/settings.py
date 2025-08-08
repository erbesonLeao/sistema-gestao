# backend/core/settings.py - VERSÃO FINAL PARA DEPLOY

from pathlib import Path
import os
import dj_database_url # Importamos a nova ferramenta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Agora, a nossa chave secreta será lida de uma "variável de ambiente" segura no servidor
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-local-key-for-development')

# SECURITY WARNING: don't run with debug turned on in production!
# O Render define a variável 'RENDER' automaticamente. Se estivermos no Render, DEBUG será False.
DEBUG = 'RENDER' not in os.environ

# Adicionamos o endereço do nosso futuro site no Render a esta lista
ALLOWED_HOSTS = []

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'maquinario',
    'rest_framework_simplejwt',
    'usuarios',
    'funcionarios',
    'estoque',
    'financeiro',
    'dashboard',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Adicionado para servir arquivos estáticos
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
TEMPLATES = [ # ... (sem alterações aqui) ...
]
WSGI_APPLICATION = 'core.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# Lógica para usar a base de dados do Render online, ou a local no seu computador
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}

# Password validation
# ... (sem alterações aqui) ...
AUTH_PASSWORD_VALIDATORS = [ # ...
]

# Internationalization
# ... (sem alterações aqui) ...
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
# ...

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = 'static/'
# Esta configuração é importante para o deploy no Render
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Default primary key field type
# ... (sem alterações aqui) ...
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuração do REST Framework (já existente)
REST_FRAMEWORK = { # ...
}

# Configuração do CORS (já existente)
CORS_ALLOW_ALL_ORIGINS = True