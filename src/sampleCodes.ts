import { SupportedLanguage } from './types';

export interface SampleSnippet {
  id: string;
  title: string;
  language: SupportedLanguage;
  description: string;
  hasBug?: boolean;
  code: string;
}

export const SAMPLE_CODES: SampleSnippet[] = [
  {
    id: 'py-palindrome',
    title: 'Palindrome Word Checker',
    language: 'python',
    description: 'Checks if a word reads the same forwards and backwards.',
    code: `def is_palindrome(text):
    # Clean the string: convert to lowercase and remove spaces
    cleaned = text.lower().replace(" ", "")
    
    # Compare original cleaned text with its reversed version
    return cleaned == cleaned[::-1]

word = "Race car"
if is_palindrome(word):
    print(f"'{word}' is a palindrome!")
else:
    print(f"'{word}' is not a palindrome.")`,
  },
  {
    id: 'py-buggy-loop',
    title: 'Average Calculator (With Bug!)',
    language: 'python',
    hasBug: true,
    description: 'Has a potential zero division bug and off-by-one issue.',
    code: `def calculate_average(numbers):
    total = 0
    # BUG: Off-by-one index error in manual loop
    for i in range(len(numbers) + 1):
        total += numbers[i]
    
    # BUG: What if numbers list is empty? ZeroDivisionError!
    return total / len(numbers)

scores = [85, 90, 78, 92]
print("Average score is:", calculate_average(scores))`,
  },
  {
    id: 'js-array-filter',
    title: 'Shopping Cart Discount & Total',
    language: 'javascript',
    description: 'Applies discount to items over $50 and computes grand total.',
    code: `const cart = [
  { name: "Wireless Headphones", price: 80 },
  { name: "Coffee Mug", price: 15 },
  { name: "Mechanical Keyboard", price: 120 },
  { name: "Stickers", price: 5 }
];

// 10% discount for items priced $50 or more
const finalTotal = cart
  .map(item => {
    if (item.price >= 50) {
      return { ...item, finalPrice: item.price * 0.9 };
    }
    return { ...item, finalPrice: item.price };
  })
  .reduce((sum, item) => sum + item.finalPrice, 0);

console.log(\`Final Cart Total: $\${finalTotal.toFixed(2)}\`);`,
  },
  {
    id: 'java-bank-account',
    title: 'Bank Account Balance Manager',
    language: 'java',
    description: 'Object-oriented class with deposit and withdraw methods.',
    code: `public class BankAccount {
    private String accountHolder;
    private double balance;

    public BankAccount(String holder, double initialDeposit) {
        this.accountHolder = holder;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println("Deposited $" + amount + ". New balance: $" + this.balance);
        }
    }

    public boolean withdraw(double amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            System.out.println("Withdrew $" + amount + ". Remaining: $" + this.balance);
            return true;
        }
        System.out.println("Insufficient funds for withdrawal.");
        return false;
    }

    public static void main(String[] args) {
        BankAccount myAccount = new BankAccount("Alice", 100.0);
        myAccount.deposit(50.0);
        myAccount.withdraw(30.0);
    }
}`,
  },
  {
    id: 'c-pointer-swap',
    title: 'Swap Two Numbers with Pointers',
    language: 'c',
    description: 'Classic C memory concept: modifying values via memory addresses.',
    code: `#include <stdio.h>

// Function takes memory addresses (pointers) of two integers
void swap(int *a, int *b) {
    int temp = *a; // dereference a: read value stored at address a
    *a = *b;       // put value at address b into address a
    *b = temp;     // put temp value into address b
}

int main() {
    int x = 42;
    int y = 99;

    printf("Before swap: x = %d, y = %d\\n", x, y);
    // Pass memory addresses using the '&' reference operator
    swap(&x, &y);
    printf("After swap:  x = %d, y = %d\\n", x, y);

    return 0;
}`,
  },
  {
    id: 'cpp-vector-stats',
    title: 'Find Maximum & Sum in Vector',
    language: 'cpp',
    description: 'C++ STL vector demonstration with range-based loops.',
    code: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

int main() {
    std::vector<int> numbers = {14, 3, 27, 88, 5, 42};

    // Calculate sum using range-based loop
    long long sum = 0;
    for (int num : numbers) {
        sum += num;
    }

    // Find maximum element
    auto maxIt = std::max_element(numbers.begin(), numbers.end());

    std::cout << "Numbers count: " << numbers.size() << "\\n";
    std::cout << "Sum: " << sum << "\\n";
    if (maxIt != numbers.end()) {
        std::cout << "Max value: " << *maxIt << "\\n";
    }

    return 0;
}`,
  },
];

export const LANGUAGES: { id: SupportedLanguage; name: string; ext: string; color: string; badge: string }[] = [
  { id: 'python', name: 'Python', ext: '.py', color: 'from-amber-400 to-blue-500', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'javascript', name: 'JavaScript', ext: '.js', color: 'from-yellow-400 to-amber-500', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
  { id: 'java', name: 'Java', ext: '.java', color: 'from-orange-500 to-red-500', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
  { id: 'c', name: 'C', ext: '.c', color: 'from-blue-400 to-cyan-500', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  { id: 'cpp', name: 'C++', ext: '.cpp', color: 'from-indigo-400 to-purple-500', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
];
