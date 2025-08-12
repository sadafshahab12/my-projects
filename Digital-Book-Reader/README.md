new FileReader()
Yeh ek special helper hai jo tumhare computer me padhi hui file ko pad sakta hai (read kar sakta hai)

error: Filhaal koi error nahi, isliye null.

onabort / onerror / onload / etc.: Yeh jagah hoti hai jahan tum function laga sakti ho jo tab chale jab file load ho, ya error ho, ya cancel ho.

readyState: Abhi file padhne shuru nahi hui (0 = not started).

result: Abhi file ka data empty hai, kyunki tumne read start nahi kiya.
