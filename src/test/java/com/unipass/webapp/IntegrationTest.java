package com.unipass.webapp;

import com.unipass.webapp.config.AsyncSyncConfiguration;
import com.unipass.webapp.config.DatabaseTestcontainer;
import com.unipass.webapp.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.context.ImportTestcontainers;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        UnipassWebApp.class,
        JacksonConfiguration.class,
        AsyncSyncConfiguration.class,
        com.unipass.webapp.config.JacksonHibernateConfiguration.class,
    }
)
@ImportTestcontainers(DatabaseTestcontainer.class)
public @interface IntegrationTest {}
