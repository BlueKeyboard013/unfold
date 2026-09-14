package com.unfold.styleprofile.swipe

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant
import java.util.UUID

enum class SwipeDirection {
    LEFT,
    RIGHT,
}

@Entity
class Swipe(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val userId: String,
    val filename: String,
    val style: String,
    @Enumerated(EnumType.STRING)
    val direction: SwipeDirection,
    val createdAt: Instant = Instant.now(),
)
