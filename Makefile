# ============================================
# CodePlay — Development Commands
# ============================================
# Usage: make <target>
# Run `make help` for all available targets
# ============================================

.PHONY: help install dev dev-backend dev-frontend build test lint clean docker-up docker-down docker-build

# Default target
help: ## Show this help message
	@echo ""
	@echo "  CodePlay — Available Commands"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install all dependencies (backend + frontend)
	@echo "📦 Installing backend dependencies..."
	cd backend && npm ci
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed!"

dev: ## Start both backend and frontend in development mode
	@echo "🚀 Starting CodePlay in development mode..."
	@make dev-backend & make dev-frontend & wait

dev-backend: ## Start backend dev server (port 5000)
	cd backend && npm run dev

dev-frontend: ## Start frontend dev server (port 5173)
	cd frontend && npm run dev

build: ## Build frontend for production
	cd frontend && npm run build

test: ## Run backend tests
	cd backend && npm test

lint: ## Lint both backend and frontend
	@echo "🔍 Linting backend..."
	cd backend && npm run lint
	@echo "🔍 Linting frontend..."
	cd frontend && npm run lint
	@echo "✅ Lint complete!"

clean: ## Remove node_modules and build artifacts
	rm -rf backend/node_modules frontend/node_modules frontend/dist
	@echo "🧹 Cleaned!"

# ============================================
# Docker Commands
# ============================================

docker-up: ## Start all services with Docker Compose
	docker compose up -d
	@echo "✅ All services running!"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend:  http://localhost:5000"
	@echo "   Gateway:  http://localhost:80"

docker-down: ## Stop all Docker services
	docker compose down
	@echo "🛑 All services stopped."

docker-build: ## Rebuild all Docker images
	docker compose build --no-cache

docker-logs: ## Tail logs for all containers
	docker compose logs -f

docker-clean: ## Remove containers, volumes, and images
	docker compose down -v --rmi local
	@echo "🧹 Docker cleaned!"
