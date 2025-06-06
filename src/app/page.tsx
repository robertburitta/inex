"use client";

import { useRouter } from "next/navigation";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-grow">
        <div className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 bg-white pb-8 sm:pb-12 md:pb-16 lg:w-full lg:max-w-2xl lg:pb-20 xl:pb-24">
              <main className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6 md:mt-12 lg:mt-16 lg:px-8 xl:mt-20">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Kontroluj swoje</span> <span className="block text-blue-600 xl:inline">finanse</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                    Śledź swoje przychody i wydatki, analizuj budżet i osiągaj swoje cele finansowe. Wszystko w jednym miejscu, dostępne z
                    każdego urządzenia.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Button
                        variant="blue"
                        size="xl"
                        onClick={() => router.push("/register")}
                      >
                        Rozpocznij za darmo
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">Funkcje</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Wszystko, czego potrzebujesz
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Kompleksowe narzędzia do zarządzania swoimi finansami.</p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:grid md:grid-cols-2 md:space-y-0 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Śledzenie wydatków</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Łatwo dodawaj i kategoryzuj swoje przychody i wydatki. Miej pełną kontrolę nad swoimi finansami.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Analiza i raporty</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Otrzymuj szczegółowe raporty i analizy swoich finansów. Podejmuj lepsze decyzje finansowe.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Cykliczne płatności</h3>
                    <p className="mt-2 text-base text-gray-500">Ustaw cykliczne płatności i nigdy nie zapomnij o ważnych opłatach.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Budżetowanie</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Twórz i zarządzaj budżetami dla różnych kategorii wydatków. Osiągaj swoje cele finansowe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">Dlaczego warto</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Proste i skuteczne zarządzanie finansami
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                InEx to więcej niż tylko aplikacja do śledzenia wydatków. To kompleksowe narzędzie do zarządzania swoimi finansami.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:grid md:grid-cols-3 md:space-y-0 md:gap-x-8 md:gap-y-10">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Bezpieczeństwo</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Twoje dane są bezpieczne i szyfrowane. Korzystamy z najnowszych standardów bezpieczeństwa.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Szybkość</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Szybkie dodawanie transakcji i natychmiastowa synchronizacja na wszystkich urządzeniach.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Dostępność</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Dostęp do aplikacji z każdego urządzenia, w każdym miejscu i o każdej porze.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">Jak to działa</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Rozpocznij w 3 prostych krokach
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:grid md:grid-cols-3 md:space-y-0 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl font-bold text-white">1</div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Zarejestruj się</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Utwórz konto w kilka sekund. Możesz użyć swojego adresu email lub konta Google.
                  </p>
                </div>

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl font-bold text-white">2</div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Dodaj transakcje</h3>
                  <p className="mt-2 text-base text-gray-500">Rozpocznij od dodania swoich pierwszych przychodów i wydatków.</p>
                </div>

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-xl font-bold text-white">3</div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Analizuj i planuj</h3>
                  <p className="mt-2 text-base text-gray-500">Korzystaj z analiz i raportów, aby lepiej zarządzać swoimi finansami.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Button
                variant="blue"
                size="lg"
                onClick={() => router.push("/register")}
              >
                Rozpocznij za darmo
                <ArrowLongRightIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
