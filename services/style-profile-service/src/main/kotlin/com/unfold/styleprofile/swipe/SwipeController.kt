package com.unfold.styleprofile.swipe

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1")
class SwipeController(private val swipeService: SwipeService) {

    @PostMapping("/swipes")
    fun recordSwipe(@Valid @RequestBody request: RecordSwipeRequest): ResponseEntity<SwipeResponse> {
        val response = swipeService.recordSwipe(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/users/{userId}/style-profile")
    fun getStyleProfile(@PathVariable userId: String): StyleProfileResponse {
        return swipeService.getStyleProfile(userId)
    }
}
