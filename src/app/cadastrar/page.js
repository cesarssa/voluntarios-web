'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',               // alterado de name
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome) {              // alterado de name
      newErrors.nome = 'Nome é obrigatório';    // alterado de name
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Criar usuário no Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              nome: formData.nome     // alterado de name
            }
          }
        });

        if (authError) throw authError;

        // Criar perfil na tabela perfis
        if (authData?.user) {
          const { error: profileError } = await supabase
            .from('perfis')           // alterado de profiles1
            .insert({
              id_usuario: authData.user.id,        // alterado de user_id
              nome: formData.nome,                 // alterado de name
              criado_em: new Date().toISOString(),      // alterado de created_at
              atualizado_em: new Date().toISOString()   // alterado de updated_at
            });

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
            throw profileError;
          }
        }

        alert('Verifique seu email para confirmar o cadastro!');
        router.push('/entrar');
        
      } catch (error) {
        console.error('Erro no cadastro:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          submit: error.message
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
    } catch (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        submit: 'Erro ao entrar com Google'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showTitle={true} showButton={false}/>

      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Crie a sua conta aqui
              </h3>
              <p className="text-center text-gray-600 text-sm mb-6">
                Preencha os dados abaixo para se cadastrar
              </p>

              {errors.submit && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              )}
 
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="nome"            // alterado de name
                    placeholder="Digite seu nome completo"
                    className={`w-full px-3 py-2 border text-gray-800 placeholder-gray-500 ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'    // alterado de name
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    value={formData.nome}    // alterado de name
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.nome && (    // alterado de name
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.nome}</p>    // alterado de name
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    className={`w-full px-3 py-2 border text-gray-800 placeholder-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Digite sua senha"
                    className={`w-full px-3 py-2 border text-gray-800 placeholder-gray-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {errors.password && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirme sua senha"
                    className={`w-full px-3 py-2 border text-gray-800 placeholder-gray-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-700 text-sm">
                  Já tem uma conta?{' '}
                  <Link 
                    href="/entrar" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Entre por aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}