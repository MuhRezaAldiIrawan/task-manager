<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1>Welcome Back</h1>
                <p>Sign in to continue to Task Manager</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" v-model="username" type="text" placeholder="Enter your username" required
                        :disabled="loading" />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" v-model="password" type="password" placeholder="Enter your password" required
                        :disabled="loading" />
                </div>

                <button type="submit" class="btn-login" :disabled="loading">
                    {{ loading ? "Signing in..." : "Sign In" }}
                </button>
            </form>

            <div class="login-footer">
                <p>Demo credentials:</p>
                <p><strong>admin</strong> / admin123 or <strong>user</strong> / user123</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";

export default {
    name: "LoginPage",
    setup() {
        const router = useRouter();
        const username = ref("");
        const password = ref("");
        const error = ref("");
        const loading = ref(false);

        const handleLogin = async () => {
            error.value = "";
            loading.value = true;

            try {
                const response = await login(username.value, password.value);

                if (response.success) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    router.push("/");
                } else {
                    error.value = response.message || "Login failed";
                }
            } catch (err) {
                error.value = err.message || "An error occurred during login";
            } finally {
                loading.value = false;
            }
        };

        return {
            username,
            password,
            error,
            loading,
            handleLogin,
        };
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.login-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 420px;
}

.login-header {
    text-align: center;
    margin-bottom: 32px;
}

.login-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
}

.login-header p {
    color: #718096;
    font-size: 14px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.error-message {
    background: #fed7d7;
    color: #c53030;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
}

.form-group input {
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.form-group input:disabled {
    background: #f7fafc;
    cursor: not-allowed;
}

.btn-login {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 13px;
    color: #718096;
}

.login-footer strong {
    color: #2d3748;
}
</style>
